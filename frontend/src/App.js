import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { SubjectProvider } from "./context/SubjectContext";

import Login from "./pages/Login";
import Account from "./pages/Account";
import Home from "./pages/Home";
import About from "./pages/About";

import Nav from "./components/layout/Nav";

import AddSubjects from "./components/forms/AddSubject";
import UserProfileForm from "./components/forms/UserProfileForm";

//subjects
import ViewSubjectsPage from "./components/data-display/ViewSubjectsPage";
import Dashboard from "./components/data-display/Dashboard";
import ViewCourses from "./components/data-display/ViewCourses";
import Footer from "./components/layout/Footer";
import UniversityCourses from "./components/data-display/UnivesityCourses";

function App() {
  return (
    <UserProvider>
      <CourseProvider>
         <SubjectProvider>
      <Router>
        <Nav />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Account />} />

            <Route path="/add-subjects" element={<AddSubjects />} />
            <Route path="/add-profile" element={<UserProfileForm />} />
            <Route path="/my-subjects" element={<ViewSubjectsPage />} />
            <Route path="/my-dashboard" element={<Dashboard />} />

            <Route path="/view-courses" element={<ViewCourses />} />

            <Route
              path="/view-courses/:courseSlug"
              element={<UniversityCourses />}
            />

          </Routes>
        </div>
      </Router>
      </SubjectProvider>
      </CourseProvider>
    </UserProvider>
  );
}

export default App;
