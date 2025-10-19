import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center animate-fadeIn">
      <h1 className="text-5xl font-bold text-blue-700 mb-6">
        Welcome to N8N Auth System
      </h1>
      <p className="text-gray-600 mb-10 max-w-md">
        This web app demonstrates Firebase authentication and real-time chat
        built with React, Tailwind, and Framer Motion.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all duration-200"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-gray-100 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-200"
        >
          Login
        </Link>
        <Link
          to="/chat"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 active:scale-95 transition-all duration-200"
        >
          Open Chat
        </Link>
      </div>
    </div>
  );
}
