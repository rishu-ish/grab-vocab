"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

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
        console.error("Failed to load quiz:", data.error);
      }
    } catch (err) {
      console.error("Error fetching exam quiz:", err);
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
    setStep(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setSelectedAnswers([]);
    setLoading(true);
    fetchQuizForExam(exam as string);
  };

  if (loading) return <p className="p-6">Loading quiz...</p>;

  if (quiz.length === 0) {
    return (
      <div className="p-6 text-red-600 text-center">
        ❌ Failed to load quiz. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 capitalize">{exam} Quiz</h1>

      {showResult ? (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            ✅ You scored {score} / {quiz.length}
          </h2>

          <div className="space-y-6">
            {quiz.map((q, i) => (
              <div
                key={q.word}
                className="p-4 border rounded-xl bg-white shadow-md"
              >
                <p className="font-medium text-indigo-700 mb-2">
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
                      className={`${
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
                <p className="text-sm text-gray-800">
                  ✅ Correct: <strong>{q.correctAnswer}</strong>
                </p>
                <p className="text-sm italic text-gray-500 mt-1">
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

          <div className="space-y-3 flex flex-col md:flex-row gap-6">
            {current.imageURL && (
              <div className="md:w-1/2 min-h-full w-full">
                <img
                  src={current.imageURL}
                  alt={current.word}
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}
            <div className="space-y-3 flex-1">
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
            <>
              <p className="mt-4 italic text-sm text-gray-600">
                💡 {current.explanation}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
