"use client";

import { useEffect, useRef, useState } from "react";

export default function QuickQuizPage() {
  const hasFetched = useRef(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const current = quiz[step];

  useEffect(() => {
    if (!hasFetched.current) {
      fetchQuiz();
      hasFetched.current = true;
    }
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setQuiz(data.data);
      } else {
        setQuiz([]);
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setQuiz([]);
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
        setStep(step + 1);
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
    fetchQuiz();
  };

  const nextQuiz = () => {
    resetQuiz();
    setLoading(true);
    fetchQuiz();
  };

  if (loading) return <p className="p-6 text-gray-700">Loading quiz...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Quick Quiz</h1>

      {showResult ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            ✅ You scored {score} / {quiz.length}
          </h2>

          <div className="space-y-6">
            {quiz.map((q, index) => (
              <div
                key={q.word}
                className="p-4 border rounded-lg bg-white shadow-md"
              >
                {q.imageURL && (
                  <img
                    src={q.imageURL}
                    alt={q.word}
                    className="w-full h-52 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="font-medium text-indigo-700 mb-2">
                  Q{index + 1}: {q.question}
                </p>

                <ul className="list-disc pl-6 mb-2">
                  {q.options.map((opt: string) => (
                    <li
                      key={opt}
                      className={`${
                        opt === q.correctAnswer
                          ? "text-green-700 font-semibold"
                          : opt === selectedAnswers[index]
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-700">
                  ✅ Correct:{" "}
                  <span className="font-medium">{q.correctAnswer}</span>
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
        <div className="bg-white border rounded-xl shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Q{step + 1}: {current.question}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            {current.imageURL && (
              <div className="w-full md:w-1/2">
                <img
                  src={current.imageURL}
                  alt={current.word}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              </div>
            )}

            {/* Options */}
            <div className="flex-1 space-y-3">
              {current.options.map((opt: any) => (
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

          {/* Explanation */}
          {selected && (
            <p className="mt-4 italic text-sm text-gray-600">
              Explanation: {current.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
