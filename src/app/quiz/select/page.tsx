"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const subjects = [
  "English-Literature",
  "History",
  "Geography",
  "Biology",
  "Chemistry",
  "Physics",
  "Political-Science",
  "Sociology",
  "Psychology",
];

const grades = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const exams = ["PCAT", "ACT", "SAT", "PSAT", "MCAT", "CPA", "GED", "TOEFL"];

export default function QuizSelectPage() {
  const router = useRouter();
  const [view, setView] = useState<"main" | "subject" | "grade" | "exam">(
    "main"
  );

  const handleSubjectClick = (sub: string) => {
    router.push(`/quiz/subject/${sub.toLowerCase()}`);
  };

  const handleGradeClick = (grade: string) => {
    router.push(`/quiz/grade/${grade.toLowerCase().replace(" ", "-")}`);
  };

  const handleExamClick = (exam: string) => {
    router.push(`/quiz/exam/${exam.toLowerCase()}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-black">
      {view === "main" && (
        <div className="">
          <h1 className="text-3xl font-bold mb-8">🎯 Choose Your Quiz</h1>

          <div className="mb-6">
            <button
              onClick={() => router.push("/quiz")}
              className="w-full py-3 text-lg bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Start Random Quiz
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setView("subject")}
              className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Select Subject
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setView("grade")}
              className="w-full py-3 text-lg bg-red-600 text-white rounded-lg hover:bg-red-400"
            >
              Select Grade
            </button>
          </div>

          <div>
            <button
              onClick={() => setView("exam")}
              className="w-full py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Select Exam
            </button>
          </div>
        </div>
      )}

      {view === "subject" && (
        <>
          <h2 className="text-2xl font-bold mb-4">📚 Choose a Subject</h2>
          <ul className="space-y-3">
            {subjects.map((sub) => (
              <li key={sub}>
                <button
                  onClick={() => handleSubjectClick(sub)}
                  className="w-full py-3 text-left px-4 bg-slate-100 hover:bg-blue-100 rounded-lg border"
                >
                  {sub.replace("-", " ")}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setView("main")}
            className="mt-6 text-indigo-600 underline"
          >
            ← Back
          </button>
        </>
      )}

      {view === "grade" && (
        <>
          <h2 className="text-2xl font-bold mb-4">🎓 Choose a Grade</h2>
          <ul className="space-y-3">
            {grades.map((g) => (
              <li key={g}>
                <button
                  onClick={() => handleGradeClick(g)}
                  className="w-full py-3 text-left px-4 bg-slate-100 hover:bg-green-100 rounded-lg border"
                >
                  {g}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setView("main")}
            className="mt-6 text-indigo-600 underline"
          >
            ← Back
          </button>
        </>
      )}

      {view === "exam" && (
        <>
          <h2 className="text-2xl font-bold mb-4">🎓 Choose a Exam</h2>
          <ul className="space-y-3">
            {exams.map((g) => (
              <li key={g}>
                <button
                  onClick={() => handleExamClick(g)}
                  className="w-full py-3 text-left px-4 bg-slate-100 hover:bg-green-100 rounded-lg border"
                >
                  {g}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setView("main")}
            className="mt-6 text-indigo-600 underline"
          >
            ← Back
          </button>
        </>
      )}
    </div>
  );
}
