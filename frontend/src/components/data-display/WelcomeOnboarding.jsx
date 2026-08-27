import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import "../../styles/WelcomeOnboarding.css";
import { roles } from "../../Utils/textData/roles";
import StudentForm from "../forms/StudentWelcomeForm";
import ParentForm from "../forms/ParentWelcomeForm";
import TutorForm from "../forms/TutorWelcomeForm";
import { saveUserProfile } from "../../services/userProfile";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeOnboarding({ onComplete }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { login } = useAuth();

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    console.log("form data",formData);
    
    try {
      const { data } = await saveUserProfile(formData);


      if (!data.success) {
        setError("Error occurred, try again!");
        return;
      }

      setSuccess("Information successfully submitted");

      //re-issue the token
      if (data?.user?.token) {
        sessionStorage.setItem("token", JSON.stringify(data.user.token));
      }

      login(data.user); // clean, no stale state

    } catch (error) {
      setError("Something went wrong, try again");
    } finally {
      setTimeout(() => {
        setError(null);
        setSuccess(null);
        setLoading(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  return (
    <div className="welcome">
      <div className="welcome__container">
        {!selectedRole ? (
          <>
            <div className="welcome__header">
              <h1 className="welcome__title">Welcome to CourseMatch</h1>
              <p className="welcome__subtitle">
                Tell us who you are so we can personalise your experience.
              </p>
            </div>

            <div className="welcome__roles">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    className="welcome__role-card"
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="welcome__role-icon">
                      <Icon size={32} strokeWidth={1.6} />
                    </div>
                    <h3 className="welcome__role-title">{role.title}</h3>
                    <p className="welcome__role-desc">{role.description}</p>
                    <button className="welcome__role-btn">
                      Continue
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {selectedRole === "student" && (
              <StudentForm
                onSubmitStudent={handleFormSubmit}
                onBack={handleBack}
                loading={loading}
                success={success}
                error={error}
              />
            )}
            {selectedRole === "parent" && (
              <ParentForm
                onSubmitParent={handleFormSubmit}
                onBack={handleBack}
                loading={loading}
                success={success}
                error={error}
              />
            )}
            {selectedRole === "tutor" && (
              <TutorForm
                onSubmitTutor={handleFormSubmit}
                onBack={handleBack}
                loading={loading}
                success={success}
                error={error}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
