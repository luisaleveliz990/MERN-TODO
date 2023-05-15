const logger = require("../../config/winston");
const APIError = require("../../utils/APIError");
const util = require("util");
const User = require("../../models/user.model");
const Todo = require("../../models/todo.model");
const { AsyncLocalStorage } = require("async_hooks");

const getTodos = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select("todos")
            .populate("todos", "-__v")

        const todos = user.todos;
        const updateResult = todos.filter(todo =>{
            return (todo.name.includes(req.query.name) || todo.detail.includes(req.query.detail));
        });

        res.status(200).json({
            todos: updateResult,
        });
    } catch (err) {
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const addTodo = async (req, res, next) => {
    try {
        let todo = Todo(req.body);
        [todo, updateResult] = await Promise.all([
            todo.save(),
            User.updateOne(
                { _id: req.user._id },
                {
                    $push: {
                        todos: todo,
                    },
                }
            ),
        ]);
        todo = await Todo.findById(todo._id).select("-__v");
        res.status(200).json({
            todo,
        });
    } catch (err) {
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateResult = await User.updateOne(
            {
                _id: req.user._id,
                todos: id,
            },
            {
                $pull: {
                    todos: id,
                },
            }
        );
        await Todo.findByIdAndDelete(id);

        if (updateResult.matchedCount === 0)
            return next(new APIError("Todo not found", 404, true));
        res.status(204).end();
    } catch (err) {
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const modifyTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateResult = await Todo.findByIdAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    name: req.body.name,
                    detail : req.body.detail,
                    done: req.body.done,
                },
            },
            { new: true }
        ).select("-__v");

        res.json({
            todo: updateResult,
        });
    } catch (err) {
        if (err.name == "CastError") {
            return next(new APIError("Todo not found", 404, true));
        }
        logger.error("Failed to add todo: " + util.inspect(err));
        return next(new APIError("Failed to add todo.", 500, true));
    }
};

const changePage = async(req,res, next) => {
    try {
        const page = parseInt(req.params.page);
        const pageSize = 5;
        const query = req.query;
        const count = await Todo.find(query).countDocuments();

        await Todo.find(query).skip((page - 1) * pageSize).limit(pageSize).exec(function(err, documents) {
            if (err) {
              console.error('Failed to retrieve data from MongoDB:', err);
              return;
            }
            res.json({count: count, todos:documents});
          });
    } catch(err) {
        if (err.name == "CastError") {
            return next(new APIError("Can't go to the page", 404, true));
        }
        logger.error("Failed to go to the page: " + util.inspect(err));
        return next(new APIError("Failed to go to the page.", 500, true));
    }
};

module.exports = { getTodos, addTodo, deleteTodo, modifyTodo, changePage };
