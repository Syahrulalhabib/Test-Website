import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", fullname: "", gender: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/register", form);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}/>
        <input type="email" placeholder="Email" className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input type="password" placeholder="Password" className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}/>
        <select className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">Register</button>
      </form>
      {msg && <p className="text-center mt-4 text-gray-700">{msg}</p>}
    </div>
  );
}
