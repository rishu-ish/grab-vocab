"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import PaginationControls from "@/components/PaginationControls";

interface Word {
  word: string;
  meaning?: string;
}

const colorOptions = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-purple-100",
];

const DictionaryWords = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/dictionary`, {
        params: { page, limit: limit, search: "" },
      });
      setWords(res.data.wordsArray || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch words:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, [page]);

  return (
    <div className="p-6 gap-6">
      <h1 className="text-2xl font-semibold mb-4">📚 Dictionary Words (A-Z)</h1>

      {loading ? (
        <p>Loading...</p>
      ) : words.length === 0 ? (
        <p>No words found.</p>
      ) : (
        <div className="grid mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {words.map((w, index) => (
            <div
              key={w.word}
              className={`rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition ${
                colorOptions[index % colorOptions.length]
              }`}
            >
              <h2 className="text-xl font-bold text-black capitalize">
                {w.word}
              </h2>
              <p className="text-gray-700 mt-1">
                {w.meaning || "No meaning available."}
              </p>
            </div>
          ))}
        </div>
      )}

      {words.length > 0 && (
        <PaginationControls
          limit={limit}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default DictionaryWords;
