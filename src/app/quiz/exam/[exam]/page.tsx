"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaTrophy,
  FaArrowRight,
  FaLightbulb,
  FaClipboardQuestion,
} from "react-icons/fa6";
import { MdCheckCircle, MdCancel } from "react-icons/md";

interface QuizQuestion {
  word: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageURL?: string;
}

export default function ExamQuizPage() {
  const { exam } = useParams();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);
  const current = quiz[step];

  useEffect(() => {
    if (!exam || hasFetched.current) return;
    hasFetched.current = true;
    fetchQuizForExam(exam as string);
  }, [exam]);

  const fetchQuizForExam = async (exam: string) => {
    try {
      const res = await fetch(`/api/quiz/exam/${exam}`);
      const data = await res.json();
      if (data.success) {
        setQuiz(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err?.error ?? "Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedAnswers((prev) => [...prev, option]);
    setSelected(option);
    if (option === current.correctAnswer) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 < quiz.length) {
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setStep(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setSelectedAnswers([]);
  };

  const nextQuiz = () => {
    resetQuiz();
    setLoading(true);
    fetchQuizForExam(exam as string);
  };

  if (loading) return <p className="p-6 text-gray-600">Loading quiz...</p>;

  if (quiz.length === 0) {
    return (
      <div className="p-6 text-red-600 text-center">
        ❌ {error || "Failed to load quiz. Please try again later."}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize flex items-center gap-2 text-[var(--accent-color)]">
        <FaClipboardQuestion /> {exam} Quiz
      </h1>

      {showResult ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-[var(--accent-color)] flex justify-center items-center gap-2">
            <FaTrophy /> You scored {score} / {quiz.length}
          </h2>

          <div className="space-y-6 text-left">
            {quiz.map((q, i) => (
              <div
                key={q.word}
                className="p-4 rounded-xl shadow-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  color: "var(--primary-text-color)",
                }}
              >
                <p className="font-medium text-[var(--accent-color)] mb-2">
                  Q{i + 1}: {q.question}
                </p>

                {q.imageURL && (
                  <img
                    src={q.imageURL}
                    alt={q.word}
                    className="w-full h-52 object-cover rounded mb-4"
                  />
                )}

                <ul className="list-disc pl-6 mb-2">
                  {q.options.map((opt) => (
                    <li
                      key={opt}
                      className={`flex items-center gap-2 ${
                        opt === q.correctAnswer
                          ? "text-green-700 font-semibold"
                          : opt === selectedAnswers[i]
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {opt === q.correctAnswer ? (
                        <MdCheckCircle />
                      ) : opt === selectedAnswers[i] ? (
                        <MdCancel />
                      ) : (
                        <span className="w-5" />
                      )}
                      {opt}
                    </li>
                  ))}
                </ul>

                <p className="text-sm">
                  ✅ Correct: <strong>{q.correctAnswer}</strong>
                </p>
                <p className="text-sm italic text-gray-600 flex items-center gap-2">
                  <FaLightbulb /> {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-x-4">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              Retry
            </button>
            <button
              onClick={nextQuiz}
              className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <FaArrowRight /> Next Quiz
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-6 rounded-xl shadow-md space-y-4"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--primary-text-color)",
          }}
        >
          <h2 className="text-xl font-semibold">
            Q{step + 1}: {current.question}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {current.imageURL && (
              <div className="md:w-1/2">
                <img
                  src={current.imageURL}
                  alt={current.word}
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1 space-y-3">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition duration-200 ${
                    selected
                      ? opt === current.correctAnswer
                        ? "bg-green-100 border-green-600 text-green-800"
                        : opt === selected
                        ? "bg-red-100 border-red-600 text-red-800"
                        : ""
                      : " "
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <p className="mt-4 italic text-sm text-gray-600 flex items-center gap-2">
              <FaLightbulb /> {current.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}