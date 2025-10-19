import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { loadFirebaseConfig } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const [user, setUser] = useState(null);
  const [authData, setAuthData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { auth } = await loadFirebaseConfig();
      setAuthData(auth);
      onAuthStateChanged(auth, (u) => setUser(u));
    })();
  }, []);

  const handleLogout = async () => {
    if (authData) {
      await signOut(authData);
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center px-6 md:px-10 py-4 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 tracking-wide">N8N Auth</h1>

        <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center text-gray-700 font-medium mt-3 md:mt-0">
          <Link className="hover:text-blue-600 transition" to="/">Home</Link>
          {!user && <Link className="hover:text-blue-600 transition" to="/register">Register</Link>}
          {!user && <Link className="hover:text-blue-600 transition" to="/login">Login</Link>}
          {user && <Link className="hover:text-blue-600 transition" to="/profile">Profile</Link>}
          {user && <Link className="hover:text-green-600 transition" to="/chat">Chat</Link>}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Halaman dengan animasi */}
      <div className="flex-grow flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>

      <footer className="text-center py-4 text-gray-500 text-sm bg-white border-t">
        © {new Date().getFullYear()} N8N Auth System — Built with React + Tailwind + Firebase
      </footer>
    </div>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
