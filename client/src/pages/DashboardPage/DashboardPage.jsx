import { useState, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";

import UserContext from "../../contexts/UserContext";
import TodoItem from "./../../components/Todo/TodoItem";
import AddTodoDialog from "../../components/Todo/AddTodoDialog";
import Pagination from "./../../components/Pagination/Pagination";
import axios from "../../config/axios";

const DashboardPage = () => {
    const pageSize = 5;
    const { user, todos, setTodos } = useContext(UserContext);
    const [showDrop, setShowDrop] = useState(false);
    const [addTodoOpen, setAddTodoOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [ todoCount, setTodoCount] = useState(0);
    const [currentPage, setPage] = useState(1);


    useEffect(() => {
        if (currentPage) {
            axios.get(`/todos/${currentPage}`)
            .then((res) => {
                if (res.todos) {
                    setTodos(res.todos);
                }
                setTodoCount(res.count);
            })
            .catch((err) => {
                console.log("Unable to go to the page: ", err);
                toast.error("Unable to go to the page");
            });
        }
    }, [currentPage]);

    const searchTodos = () => {
        setPage(1);
        const value = searchText;
        axios.get(`/todos/?name=${value}&detail=${value}`)
        .then((res) => {
            if (res.todos) {
                setTodoCount(res.todos.length);
                setPage(1);
                setTodos(res.todos);
            }
        })
        .catch((err) => {
            console.log("Unable to find todos: ", err);
            toast.error("Unable to efind todos");
            closeModal();
        });
    }

    const handleShowDrop = () => setShowDrop(!showDrop);

    return (
        <div className="flex-1 bg-neutral-50">
            <AddTodoDialog
                isOpen={addTodoOpen}
                setIsOpen={setAddTodoOpen}
                setShowSuccesDialog={() => {}}
            />
            {/* Max width wrapper */}
            <div className="mx-auto min-h-[30rem] w-full max-w-7xl px-2 pb-8 pt-4 sm:px-4">
                <main className="w-full space-y-4">
                    {/* Hello section */}
                    <div className="overflow-hidden rounded-lg bg-gradient-to-l from-green-200 via-white to-white shadow">
                        <div className="flex items-center justify-between px-4 py-5 sm:p-6">
                            <h1 className="text-4xl font-bold">
                                Hello, {user.username}.
                            </h1>
                        </div>
                    </div>

                    {/* Todos section */}
                    <section className="bg-white rounded-lg px-4 py-5 shadow sm:p-6 lg:flex-row lg:space-y-2 lg:space-x-4">
                        <div className="flex w-full flex-col">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Your Todos
                                </h2>
                                <div className="relative flex">
                                    <div className="relative mr-2">
                                    <input type="search" id="search-dropdown" className="block h-11 p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:border-gray-300 focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" placeholder="Search Tasks..." value={searchText} onInput={(e) => setSearchText(e.target.value)} required />
                                    <button className="absolute top-0 right-0 p-2.5 h-11 text-sm font-medium text-white bg-green-600 rounded-r-lg border border-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700" onClick={searchTodos}>
                                        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                    </div>
                                    <button
                                        className="h-11 w-32 rounded border border-transparent bg-green-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={() => setAddTodoOpen(true)}
                                    >
                                        Add Todo
                                    </button>  
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-5">
                                {/* Todo item */}
                                {todos.length == 0 && (
                                    <p className="text-gray-600">No todos</p>
                                )}
                                {todos.map((todo) => {
                                    return (
                                        <TodoItem todo={todo} key={todo._id} />
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                    {/* Pagination section */}
                    <div className="overflow-hidden rounded-lg bg-gradient-to-l from-green-200 via-white to-white shadow">
                        <Pagination itemsCount={todoCount} pageSize={pageSize} currentPage={currentPage} onPageChange={setPage}/>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
