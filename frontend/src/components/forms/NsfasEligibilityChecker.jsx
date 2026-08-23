import { useState, useEffect } from "react";
import { NSFAS_QUESTIONS } from "../../Utils/textData/nsfasEligibilityQuestions";
import { checkNsfasEligibility } from "../../Utils/textData/nsfasEligibilityChecker";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import "../../styles/NsfasEligibilityChecker.css";
import { getPageRelatedPosts } from "../../services/blogService";
import RelatedPosts from "../RelatedPosts";
import PageHeader from "../ui/PageHeader";
import SEO from "../ui/SEO";
import { nsfasEligibilityFaqs } from "../../Utils/textData/SeoFaqs";

export default function NsfasEligibilityChecker() {
  const [answers, setAnswers] = useState({
    isSouthAfrican: null,
    hasDisability: null,
    annualHouseholdIncome: null,
    hasReceivedNsfasBefore: null,
    previousFunding: {
      yearsFunded: null,
      qualificationDuration: null,
      exceededNPlusOne: null,
    },
    institutionType: null,
  });

  const [relatedPosts, setRelatedPosts] = useState(null);

  useEffect(() => {
    fetchPageRelatedPosts();
  }, []);

  const fetchPageRelatedPosts = async () => {
    try {
      const { data } = await getPageRelatedPosts("NSFAS");

      if (data.success) {
        setRelatedPosts(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);

  const visibleQuestions = NSFAS_QUESTIONS.filter(
    (q) => !q.shouldShow || q.shouldShow(answers),
  );

  const getAnswerValue = (id) => {
    if (id.includes(".")) {
      const [parent, child] = id.split(".");
      return answers[parent]?.[child] ?? null;
    }
    return answers[id] ?? null;
  };

  const currentQuestion = visibleQuestions.find(
    (q) => getAnswerValue(q.id) === null,
  );

  const progress =
    visibleQuestions.length > 0
      ? ((visibleQuestions.indexOf(currentQuestion) === -1
          ? visibleQuestions.length
          : visibleQuestions.indexOf(currentQuestion)) /
          visibleQuestions.length) *
        100
      : 100;

  const handleAnswer = (id, value) => {
    setAnswers((prev) => {
      if (id.includes(".")) {
        const [parent, child] = id.split(".");
        return {
          ...prev,
          [parent]: { ...prev[parent], [child]: value },
        };
      }
      return { ...prev, [id]: value };
    });
    setInputValue("");
  };

  const handleNumberSubmit = (question) => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || inputValue === "") return;
    handleAnswer(question.id, parsed);
  };

  const handleReset = () => {
    setAnswers({
      isSouthAfrican: null,
      hasDisability: null,
      annualHouseholdIncome: null,
      hasReceivedNsfasBefore: null,
      previousFunding: {
        yearsFunded: null,
        qualificationDuration: null,
        exceededNPlusOne: null,
      },
      institutionType: null,
    });
    setInputValue("");
    setResult(null);
  };

  // All visible questions answered — compute result
  if (!currentQuestion && !result && visibleQuestions.length > 0) {
    const computed = checkNsfasEligibility(answers);
    setResult(computed);
  }

  const answeredCount = visibleQuestions.filter(
    (q) => getAnswerValue(q.id) !== null,
  ).length;

  return (
    <>
      <SEO
        title="NSFAS Eligibility Checker South Africa | CourseMatch"
        description="Check whether you may qualify for NSFAS funding. Use the free NSFAS Eligibility Checker to assess common funding requirements for South African students."
        url="https://coursematchapp.co.za/nsfas-eligibility-checker"
        faq={nsfasEligibilityFaqs}
      />{" "}
      <div className="nec">
        {/* Hero */}
        <PageHeader
          icon={ShieldCheck}
          title="NSFAS Eligibility Checker"
          subtitle="Answer a few quick questions to find out if you may qualify for
              NSFAS funding."
        />

        {/* Progress */}
        {!result && (
          <div className="nec__progress">
            <div className="nec__progress-track">
              <div
                className="nec__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="nec__progress-label">
              {answeredCount}
              <span className="nec__progress-sep">/</span>
              {visibleQuestions.length}
            </span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`nec__result ${result.eligible ? "nec__result--eligible" : "nec__result--ineligible"}`}
          >
            <div className="nec__result-icon">
              {result.eligible ? (
                <CheckCircle2 size={32} strokeWidth={1.8} />
              ) : (
                <XCircle size={32} strokeWidth={1.8} />
              )}
            </div>
            <div className="nec__result-body">
              <h2 className="nec__result-title">
                {result.eligible
                  ? "You may qualify for NSFAS"
                  : "You may not qualify for NSFAS"}
              </h2>

              {result.reasons.length > 0 && (
                <ul className="nec__result-list">
                  {result.reasons.map((r, i) => (
                    <li
                      key={i}
                      className="nec__result-item nec__result-item--reason"
                    >
                      <XCircle size={14} strokeWidth={2} />
                      {r}
                    </li>
                  ))}
                </ul>
              )}

              {result.warnings.length > 0 && (
                <ul className="nec__result-list">
                  {result.warnings.map((w, i) => (
                    <li
                      key={i}
                      className="nec__result-item nec__result-item--warning"
                    >
                      <AlertTriangle size={14} strokeWidth={2} />
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="nec__reset-btn" onClick={handleReset}>
              <RotateCcw size={15} strokeWidth={2} />
              Start over
            </button>
          </div>
        )}

        {/* Question card */}
        {!result && currentQuestion && (
          <div className="nec__card">
            <p className="nec__question">{currentQuestion.label}</p>

            {/* Radio */}
            {currentQuestion.type === "radio" && (
              <div className="nec__options">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={String(opt.value)}
                    className="nec__option"
                    onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                  >
                    {opt.label}
                    <ChevronRight
                      size={15}
                      strokeWidth={2}
                      className="nec__option-arrow"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Number / Currency */}
            {(currentQuestion.type === "number" ||
              currentQuestion.type === "currency") && (
              <div className="nec__input-wrap">
                {currentQuestion.prefix && (
                  <span className="nec__input-prefix">
                    {currentQuestion.prefix}
                  </span>
                )}
                <input
                  className="nec__input"
                  type="number"
                  placeholder={currentQuestion.placeholder || "Enter a value"}
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNumberSubmit(currentQuestion);
                  }}
                />
                {currentQuestion.suffix && (
                  <span className="nec__input-suffix">
                    {currentQuestion.suffix}
                  </span>
                )}
                <button
                  className="nec__input-btn"
                  onClick={() => handleNumberSubmit(currentQuestion)}
                  disabled={inputValue === ""}
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Previous answers */}
        {!result && answeredCount > 0 && (
          <div className="nec__history">
            <p className="nec__history-label">Your answers so far</p>
            <div className="nec__history-list">
              {visibleQuestions
                .filter((q) => getAnswerValue(q.id) !== null)
                .map((q) => {
                  const val = getAnswerValue(q.id);
                  const display =
                    q.type === "radio"
                      ? (q.options.find((o) => o.value === val)?.label ??
                        String(val))
                      : q.prefix
                        ? `${q.prefix}${Number(val).toLocaleString()}`
                        : `${val}${q.suffix ? " " + q.suffix : ""}`;
                  return (
                    <div key={q.id} className="nec__history-item">
                      <span className="nec__history-q">{q.label}</span>
                      <span className="nec__history-a">{display}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <RelatedPosts
          posts={relatedPosts}
          header="Here are some of the NSFAS related posts"
        />
      </div>
    </>
  );
}
