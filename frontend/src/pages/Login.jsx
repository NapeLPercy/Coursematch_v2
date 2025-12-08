//src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import AuthCard from "../components/layout/AuthCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login data:", form);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      console.log("Server response:", response.data);

      const user = response.data.user;
      const student = user.student;

      
      if(student){
        sessionStorage.setItem("student", JSON.stringify(student));
      }

      console.log("logging user here", user, student);
    
      alert("Login successful!");
      login(user);
      navigate("/my-dashboard");
      //redirect or
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <AuthCard title="Login to CourseMatch">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        <p className="text-center mt-3">
          <a href="/forgot-password">Forgot password?</a>
        </p>
        <p className="text-center mt-3">
          Don’t have an account? <a href="/register">Create One</a>
        </p>
      </form>
    </AuthCard>
  );
}
