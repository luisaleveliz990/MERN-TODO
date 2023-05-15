import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
    {
        name: "Dashboard",
        link: "/",
    },
    {
        name: "Profile",
        link: "/profile",
    },
    {
        name: "Login",
        link: "/login",
    },
    {
        name: "Signup",
        link: "/signup",
    },
];

const Footer = () => {
    return (
        <footer className="bg-zinc-900 py-12 px-4 text-base text-white sm:px-6 md:px-8 lg:py-16 lg:px-8 lg:pb-8">
            <div className="mx-auto max-w-7xl">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Quick Links
                </h3>
                <ul className="grid gap-x-8 sm:grid-cols-2  md:flex">
                    {footerLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.link}
                                className="text-base text-zinc-300 hover:text-white"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-12 border-t border-zinc-600 pt-8">
                    <p className="text-base text-zinc-400 xl:text-center">
                        &copy;{" "}
                        <a
                            href = "https://www.linkedin.com/in/luis-montano-33a073246/"
                            target="_blank"
                            className="border-b-2 border-zinc-500"
                        >
                            Luis Montano
                        </a>{" "}
                        {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
