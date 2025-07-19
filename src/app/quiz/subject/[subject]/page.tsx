"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type QuizQuestion = {
  word: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageURL?: string;
};

export default function SubjectQuizPage() {
  const { subject } = useParams();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const hasFetched = useRef(false);

  const current = quiz[step];

  useEffect(() => {
    if (!subject || hasFetched.current) return;
    hasFetched.current = true;
    fetchQuiz();
  }, [subject]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/subject/${subject}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setQuiz(data.data);
      } else {
        alert("Failed to load quiz.");
      }
    } catch (err) {
      console.log("❌ Failed to fetch quiz:", err);
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
    hasFetched.current = false;
    resetQuiz();
    fetchQuiz();
  };

  if (loading) return <p className="p-6">Loading quiz...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Subject Quiz: {subject?.toString().replace("-", " ")}
      </h1>

      {showResult ? (
        <div className="text-center">
          <h2 className="text-2xl mb-4">
            ✅ You scored {score} / {quiz.length}
          </h2>

          <div className="mt-6 space-y-6 text-left">
            {quiz.map((q, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-xl border shadow-sm space-y-2"
              >
                <p className="font-medium text-indigo-700">
                  Q{i + 1}: {q.question}
                </p>

                {q.imageURL && (
                  <img
                    src={q.imageURL}
                    alt={q.word}
                    className="w-full object-cover rounded-md"
                  />
                )}

                <ul className="pl-4 space-y-1 text-left">
                  {q.options.map((opt) => (
                    <li
                      key={opt}
                      className={`pl-2 ${
                        opt === q.correctAnswer
                          ? "text-green-700 font-semibold"
                          : opt === selectedAnswers[i]
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>

                <p className="text-sm">
                  ✅ Correct Answer: <strong>{q.correctAnswer}</strong>
                </p>
                <p className="text-sm italic text-gray-600">
                  💡 {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-x-4">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry Same Quiz
            </button>
            <button
              onClick={nextQuiz}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold">
            Q{step + 1}: {current.question}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {current.imageURL && (
              <div className="md:w-1/2 min-h-full w-full relative">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-md">
                    <span className="text-gray-500 animate-pulse">
                      Loading image...
                    </span>
                  </div>
                )}
                <img
                  src={current.imageURL}
                  alt={current.word}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
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
                  className={`w-full text-left px-4 py-3 rounded-lg border transition duration-200
                ${
                  selected
                    ? opt === current.correctAnswer
                      ? "bg-green-100 border-green-600 text-green-800"
                      : opt === selected
                      ? "bg-red-100 border-red-600 text-red-800"
                      : "bg-white"
                    : "bg-white hover:bg-indigo-100"
                }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <p className="mt-4 italic text-sm text-gray-600">
              💡 {current.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
