import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";


const domainQuestions = [
  {
    id: 1,
    domain: "stress",
    question: "I feel overwhelmed or mentally exhausted by daily responsibilities.",
  },
  {
    id: 2,
    domain: "anxiety",
    question: "I often feel nervous, tense, or unable to relax.",
  },
  {
    id: 3,
    domain: "depression",
    question:
      "I frequently feel sad, empty, or uninterested in things I used to enjoy.",
  },
  {
    id: 4,
    domain: "sleep",
    question:
      "I struggle with falling asleep, staying asleep, or waking up feeling rested.",
  },
  {
    id: 5,
    domain: "selfEsteem",
    question: "I often doubt myself or feel like I'm not good enough.",
  },
  {
    id: 6,
    domain: "anger",
    question: "I get irritated or angry more easily than normal.",
  },
  {
    id: 7,
    domain: "loneliness",
    question:
      "I often feel lonely, disconnected, or unsupported by others.",
  },
];

const severityQuestions = {
  stress: [
    "I feel too drained to complete daily tasks.",
    "I get irritated or overwhelmed quickly.",
    "I find it hard to focus or stay productive.",
  ],
  anxiety: [
    "My thoughts race or spiral out of control.",
    "I expect negative outcomes even without clear reasons.",
    "I experience physical symptoms like shaking or fast heartbeat.",
  ],
  depression: [
    "I have low energy or motivation most days.",
    "I feel hopeless about my future.",
    "I struggle to carry out basic daily tasks.",
  ],
  sleep: [
    "I lie awake for long periods before falling asleep.",
    "I wake up multiple times during the night.",
    "My daytime energy is low because of poor sleep.",
  ],
  selfEsteem: [
    "I criticize myself more than I praise myself.",
    "I avoid opportunities because I'm afraid to fail.",
    "I compare myself negatively to others.",
  ],
  anger: [
    "I get angry over small issues.",
    "My anger affects my relationships or daily life.",
    "I struggle to calm down once I get upset.",
  ],
  loneliness: [
    "I feel emotionally disconnected from people around me.",
    "I rarely feel understood or supported.",
    "I wish I had someone to talk to but often don't.",
  ],
};

const likertOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

function Assessment() {
  const { user } = useContext(UserContext);
  const naviagte = useNavigate();
  const displayName =
    (user && (user.name || user.username || user.email)) || "friend";
  const [hasStarted, setHasStarted] = useState(false);
  const [stage, setStage] = useState("domain"); // "domain" | "severity" | "done"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [domainAnswers, setDomainAnswers] = useState(
    Array(domainQuestions.length).fill(null)
  );
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [severityAnswers, setSeverityAnswers] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalDomainQuestions = domainQuestions.length;

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleSelectOption = (value) => {
    if (stage === "domain") {
      const updated = [...domainAnswers];
      updated[currentIndex] = value;
      setDomainAnswers(updated);
    } else if (stage === "severity" && selectedDomain) {
      const updated = [...severityAnswers];
      updated[currentIndex] = value;
      setSeverityAnswers(updated);
    }
  };

  const goToNext = () => {
    if (stage === "domain") {
      if (domainAnswers[currentIndex] == null) {
        toast.error("Please select an option before moving on 🤝");
        return;
      }

      if (currentIndex < totalDomainQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // identify domain
        const byDomain = {};
        domainQuestions.forEach((q, idx) => {
          byDomain[q.domain] = domainAnswers[idx] ?? 0;
        });

        // First try to find a domain with a strong agree (5)
        let pickedDomain =
          domainQuestions.find(
            (q, idx) => byDomain[q.domain] === 5 && domainAnswers[idx] === 5
          )?.domain || null;

        if (!pickedDomain) {
          // fallback: highest scoring domain
          pickedDomain = Object.entries(byDomain).sort(
            (a, b) => b[1] - a[1]
          )[0]?.[0];
        }

        if (!pickedDomain) {
          toast.error("Please answer at least one question to continue 🙏");
          return;
        }

        setSelectedDomain(pickedDomain);
        setStage("severity");
        setCurrentIndex(0);
      }
    } else if (stage === "severity" && selectedDomain) {
      if (severityAnswers[currentIndex] == null) {
        toast.error("Please choose an answer before moving ahead 💭");
        return;
      }

      const totalSeverityQuestions = severityQuestions[selectedDomain].length;
      if (currentIndex < totalSeverityQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const goToPrevious = () => {
    if (stage === "domain") {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    } else if (stage === "severity") {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        // go back to last domain question
        setStage("domain");
        setCurrentIndex(totalDomainQuestions - 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedDomain) return;

    const totalSeverityQuestions = severityQuestions[selectedDomain].length;
    const hasAllSeverity = severityAnswers
      .slice(0, totalSeverityQuestions)
      .every((val) => val != null);

    if (!hasAllSeverity) {
      toast.error("Please finish all the remaining questions 🌟");
      return;
    }

    const payload = {
      domainAnswers,
      selectedDomain,
      severityAnswers,
    };

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("Auth-Token");
      
      await axios.post("/user/assessment", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Assessment submitted successfully 🎉");
      setStage("done");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || "Something went wrong while submitting. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressText = () => {
    if (stage === "domain") {
      const current = currentIndex + 1;
      const remaining = totalDomainQuestions - current;
      if (remaining > 0) {
        return `Great going, ${displayName}! ${remaining} more to go 💪`;
      }
      return `Last one for this part, you're doing amazing ✨`;
    }

    if (stage === "severity" && selectedDomain) {
      const totalSeverityQuestions = severityQuestions[selectedDomain].length;
      const current = currentIndex + 1;
      const remaining = totalSeverityQuestions - current;
      if (remaining > 0) {
        return `Almost there, ${displayName} – just ${remaining} more 💫`;
      }
      return `Final question, you've got this 🌈`;
    }

    return "";
  };

  const renderQuestion = () => {
    if (stage === "done") {
      return (
        <div className="text-center space-y-4">

          <h2 className="text-2xl font-semibold text-[#3B3B98]">
            Thank you, {displayName} 💙
          </h2>
          <p className="text-gray-700">
            We&apos;ve received your responses. This helps us understand your current
            mental wellness, especially around{" "}
            <span className="font-semibold">
              {selectedDomain && selectedDomain.toUpperCase()}
            </span>
            .
          </p>
          <p className="text-gray-600">
            You can now explore personalized resources, or talk to our chatbot
            for more support.
            <Link to={'/chatbot'}>
            Lets Go...
            </Link>
          </p>
        </div>
      );
    }

    if (stage === "domain") {
      const q = domainQuestions[currentIndex];
      const selectedValue = domainAnswers[currentIndex];
      return (
        <>
          <p className="text-sm text-gray-500 mb-1">
            Question {currentIndex + 1} of {totalDomainQuestions}
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#3B3B98] mb-4">
            {q.question}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
            {likertOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(opt.value)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition-all text-sm ${
                  selectedValue === opt.value
                    ? "bg-[#3B3B98] text-white border-[#3B3B98] shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold">{opt.value}</span>
                <span className="mt-1 text-[11px] text-center">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (stage === "severity" && selectedDomain) {
      const questions = severityQuestions[selectedDomain];
      const qText = questions[currentIndex];
      const selectedValue = severityAnswers[currentIndex];
      return (
        <>
          <p className="text-sm text-gray-500 mb-1">
            Follow-up {currentIndex + 1} of {questions.length}
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#3B3B98] mb-4">
            {qText}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
            {likertOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(opt.value)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition-all text-sm ${
                  selectedValue === opt.value
                    ? "bg-[#3B3B98] text-white border-[#3B3B98] shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold">{opt.value}</span>
                <span className="mt-1 text-[11px] text-center">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </>
      );
    }

    return null;
  };

  const showSubmitButton =
    stage === "severity" &&
    selectedDomain &&
    currentIndex === severityQuestions[selectedDomain].length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC] px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8 ">
        <p onClick={()=> {naviagte('/')}} className=" cursor-pointer"> ⬅️ Go Back</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 mb-24 mt-2 ">
          <div>
            <h1 className="text-3xl font-bold text-[#3B3B98]">
              Assessment
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              A quick check-in to understand your mental wellness 🌱
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Estimated time: 2–3 minutes ⏱️
            </p>
          </div>
        </div>

        {!hasStarted ? (
          <div className="flex justify-between items-center">
            <div className="space-y-4">
            <p className="text-lg font-medium text-gray-800">
              Hi {displayName}, ready for a quick check-in? 💫
            </p>
            <p className="text-sm text-gray-600">
              This will help us understand how you&apos;ve been feeling lately.
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="mt-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#3B3B98] text-white font-medium hover:bg-[#2F2F89] transition-all shadow-md"
            >
              Start assessment ✨
            </button>
          </div>
          <img
          src="/images/Chatbot.avif"
            className="md:h-[150px] h-[] rounded-lg object-cover"
            alt="Chatbot Preview"
          />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">{renderProgressText()}</p>
            </div>

            <div className="mb-6">{renderQuestion()}</div>

            {stage !== "done" && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={stage === "domain" && currentIndex === 0}
                >
                  ⬅️ Previous
                </button>

                <div className="flex items-center gap-3">
                  {showSubmitButton && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit 🌈"}
                    </button>
                  )}
                  {!(stage === "severity" && showSubmitButton) && (
                    <button
                      type="button"
                      onClick={goToNext}
                      className="px-4 py-2 rounded-full bg-[#3B3B98] text-white text-sm font-medium hover:bg-[#2F2F89] transition-all shadow-md"
                    >
                      Next ➡️
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Assessment;