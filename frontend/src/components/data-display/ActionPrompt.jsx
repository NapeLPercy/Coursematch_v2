import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import "../../styles/ActionPrompt.css";

export default function ActionPrompt({
  icon: Icon,
  title,
  subtitle,
  btnText,
  navigateTo,
}) {
  const navigate = useNavigate();

  return (
    <div className="sp">
      <div className="sp__card">

        {/* Glow ring */}
        <div className="sp__ring sp__ring--outer" />
        <div className="sp__ring sp__ring--inner" />

        {/* Icon */}
        <div className="sp__icon-wrap">
          <div className="sp__icon-circle">
            {Icon
              ? <Icon size={32} strokeWidth={1.8} />
              : <CheckCircle2 size={32} strokeWidth={1.8} />
            }
          </div>
        </div>

        {/* Check mark */}
        <div className="sp__check">
          <CheckCircle2 size={20} strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div className="sp__text">
          <h1 className="sp__title">{title}</h1>
          {subtitle && <p className="sp__subtitle">{subtitle}</p>}
        </div>

        {/* Divider */}
        <div className="sp__divider" />

        {/* Button */}
        <button
          className="sp__btn"
          onClick={() => navigate(navigateTo)}
        >
          {btnText}
            <ArrowRight size={16} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}