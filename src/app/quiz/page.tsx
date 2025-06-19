"use client";

import { useEffect, useState } from "react";

const dummyQuestions = [
  {
    word: "abate",
    question: "What does the word 'abate' mean?",
    options: ["to increase", "to lessen", "to hide", "to change"],
    correctAnswer: "to lessen",
    explanation: "'Abate' means to reduce in amount, degree, or intensity.",
  },
  {
    word: "lucid",
    question: "Which of the following best defines 'lucid'?",
    options: ["confusing", "clear", "angry", "silent"],
    correctAnswer: "clear",
    explanation: "'Lucid' means expressed clearly and easy to understand.",
  },
];

export default function QuickQuizPage() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const current = quiz[step];

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setQuiz(data.data);
      } else {
        console.warn("Falling back to dummy quiz.");
        setQuiz(dummyQuestions);
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setQuiz(dummyQuestions);
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
    setLoading(true);
    fetchQuiz();
    setStep(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
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

          <div className="text-center mt-8">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry Quiz
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-4">
            Q{step + 1}: {current.question}
          </h2>
          <div className="space-y-3">
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
