import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadFirebaseConfig } from "../firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [msg, setMsg] = useState("");
  const [authData, setAuthData] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { auth, provider } = await loadFirebaseConfig();
      setAuthData({ auth, provider });
    })();
  }, []);

  const handleGoogleLogin = async () => {
    if (!authData) return;
    const { auth, provider } = authData;
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post("http://localhost:8080/google-login", { idToken });
      setMsg(res.data.message || "Login with Google success!");
    } catch (err) {
      console.error(err);
      setMsg("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!authData) return;
    const { auth } = authData;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const idToken = await userCredential.user.getIdToken();
      const res = await axios.post("http://localhost:8080/email-login", { idToken });
      setMsg(res.data.message || "Login success!");
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-6 text-blue-600">Sign In</h2>

      <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
        <input
          type="email"
          placeholder="Email"
          required
          className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-2 text-gray-500 text-sm">or</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white py-3 rounded-md shadow transition-all duration-200 disabled:opacity-50"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-6 h-6 mr-2"
        />
        Continue with Google
      </button>

      {msg && (
        <p className="text-center mt-4 text-gray-700 bg-gray-100 rounded-lg p-2">
          {msg}
        </p>
      )}
    </div>
  );
}
