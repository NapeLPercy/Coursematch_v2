import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { SubjectProvider } from "./context/SubjectContext";

import Login from "./pages/Login";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Features from "./pages/Features";

import AddSubjects from "./components/forms/AddSubjects";
import MyAIRecommendedCourses from "./components/data-display/MyAIRecommendedCourses";
//subjects
import ViewSubjectsPage from "./components/data-display/ViewSubjectsPage";
import StudentDashboard from "./components/data-display/StudentDashboard";
import TutorDashboard from "./components/data-display/TutorDashboard";
import ParentDashboard from "./components/data-display/ParentDashboard";
import StudentViewUniversities from "./components/data-display/StudentViewUniversities";
import UniversityCourses from "./components/data-display/UnivesityCourses";

//auth
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import VerifyAccount from "./pages/VerifyAccount";

import MainLayout from "./components/layout/MainLayout";
import NavLayout from "./components/layout/NavLayout";
import AuthLayout from "./components/layout/AuthLayout";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AdminAddQualification from "./components/forms/AdminAddCourse";
import AdminManageQualifications from "./components/data-display/AdminManageQualifications";
import AdminViewQualification from "./components/data-display/AdminViewQualification";
import AdminDashboard from "./components/data-display/AdminDashboard";
import AdminManageUniversities from "./components/data-display/AdminManageUniversities";
import NotAuthorized from "./pages/NotAuthorized";
import RoleRoute from "./routes/RoleRoute";
import StudentMatchedCourses from "./components/data-display/StudentMatchedCourses";
//cookies
import CookieModal from "./components/data-display/CookieModal";
import RouteTracking from "./routes/RouteTracking";

import ScrollToTop from "./components/ScrollToTop";
import WelcomeOnboarding from "./components/data-display/WelcomeOnboarding";
import GuestCalculateAPS from "./components/forms/GuestCalculateAPS";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import ManageBlogs from "./components/data-display/ManageBlogs";
import DeepDive from "./components/data-display/DeepDive";
import AdminManageAccounts from "./components/data-display/AdminManageAccounts";
import SendEmailPage from "./components/forms/SendEmailPage";
import NsfasEligibilityChecker from "./components/forms/NsfasEligibilityChecker";
import CourseComparisons from "./components/data-display/CourseComparisons";
import PersonalityProfileWizard from "./components/forms/PersonalityProfileWizard";
import ViewMyProfile from "./components/data-display/ViewMyProfile";
import DiplomaCourses from "./pages/DiplomaCourses";
import NoMathsCourses from "./pages/NoMathsCourses";
import HigherCertificateCourses from "./pages/HighCertificateCourses";
import ExtendedProgrammes from "./pages/ExtendedCourses";
import BachelorCourses from "./pages/BachelorCourses";
import Prospectus from "./components/data-display/Prospectus";
import AddProspectus from "./components/forms/AddProspectus";
import TermsOfService from "./components/data-display/legal/TermsOfService";
import CookiePolicy from "./components/data-display/legal/CookiePolicy";
import PrivacyPolicy from "./components/data-display/legal/PrivacyPolicy";
import Popia from "./components/data-display/legal/POPIA";
function App() {
  return (
    <UserProvider>
      <CourseProvider>
        <SubjectProvider>
          <Router>
            <ScrollToTop />
            <CookieModal />
            <RouteTracking />

            <Routes>
              {/* Public pages with nav/footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact-us" element={<Contact />} />
                {/*LEGAL*/}
                <Route
                  path="/terms-and-conditions"
                  element={<TermsOfService />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/popia" element={<Popia />} />

                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
              </Route>

              {/* Shows nav only */}
              <Route element={<NavLayout />}>
                {/*GUEST */}

                <Route path="/aps-calculator" element={<GuestCalculateAPS />} />

                <Route
                  path="/nsfas-eligibility-checker"
                  element={<NsfasEligibilityChecker />}
                />

                <Route
                  path="/university-prospectuses"
                  element={<Prospectus />}
                />

                <Route path="/diploma-courses" element={<DiplomaCourses />} />

                <Route
                  path="/bachelor-degree-courses"
                  element={<BachelorCourses />}
                />

                <Route
                  path="/extended-programmes"
                  element={<ExtendedProgrammes />}
                />

                <Route
                  path="/higher-certificate-courses"
                  element={<HigherCertificateCourses />}
                />

                <Route
                  path="/courses-without-maths"
                  element={<NoMathsCourses />}
                />

                {/* Logged-in routes (STUDENT) */}
                <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
                  <Route
                    path="/student/view/my-recommeded-courses"
                    element={<MyAIRecommendedCourses />}
                  />
                  <Route
                    path="/student/add/subjects"
                    element={<AddSubjects />}
                  />
                  <Route
                    path="/student/view/subjects"
                    element={<ViewSubjectsPage />}
                  />
                  <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                  />
                  <Route
                    path="/view-courses"
                    element={<StudentViewUniversities />}
                  />

                  <Route
                    path="/student/ai-recommended-courses"
                    element={<StudentMatchedCourses />}
                  />
                  <Route
                    path="/view-courses/:courseSlug"
                    element={<UniversityCourses />}
                  />
                  <Route
                    path="/student/add/personality"
                    element={<PersonalityProfileWizard />}
                  />

                  <Route
                    path="/student/view/personality"
                    element={<ViewMyProfile />}
                  />

                  <Route
                    path="/student/course-deep-dive"
                    element={<DeepDive />}
                  />

                  <Route
                    path="/student/course-comparisons"
                    element={<CourseComparisons />}
                  />
                </Route>

                {/* Logged-in routes (PARENT) */}
                <Route element={<RoleRoute allowedRoles={["PARENT"]} />}>
                  <Route
                    path="/parent/dashboard"
                    element={<ParentDashboard />}
                  />
                </Route>

                {/* Logged-in routes (TUTOR) */}
                <Route element={<RoleRoute allowedRoles={["TUTOR"]} />}>
                  <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                </Route>

                {/* Logged-in routes (ADMIN) */}
                <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route
                    path="/admin/manage-qualifications"
                    element={<AdminManageQualifications />}
                  />

                  <Route
                    path="/admin/manage/university-prospectuses"
                    element={<Prospectus />}
                  />

                  <Route
                    path="/admin/add/university-prospectus"
                    element={<AddProspectus />}
                  />

                  <Route
                    path="/admin/manage-universities"
                    element={<AdminManageUniversities />}
                  />

                  <Route
                    path="/admin/manage-accounts"
                    element={<AdminManageAccounts />}
                  />
                  <Route
                    path="/admin/add-qualification"
                    element={<AdminAddQualification />}
                  />
                  <Route
                    path="/admin/view-qualifications"
                    element={<AdminViewQualification />}
                  />

                  <Route path="/admin/manage-blogs" element={<ManageBlogs />} />

                  <Route path="/admin/send-email" element={<SendEmailPage />} />
                </Route>
              </Route>

              {/* Logged-in routes (ADMIN) */}
              <Route element={<RoleRoute allowedRoles={["GUEST"]} />}>
                <Route path="/welcome" element={<WelcomeOnboarding />} />
              </Route>

              {/* Full screen auth pages */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Account />} />
                <Route path="/request-reset" element={<RequestReset />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-account" element={<VerifyAccount />} />
              </Route>

              <Route path="*" element={<NotFound />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </Router>
        </SubjectProvider>
      </CourseProvider>
    </UserProvider>
  );
}

export default App;
