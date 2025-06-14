"use client";

import { useEffect, useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import SubjectWordDetailsDisplay from "./SubjectWordDisplay";

interface WordResult {
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  wordForms: string[];
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  memoryTrick: string;
  origin: string;
  imageURL?: string;
}

interface SubjectWordsListProps {
  subject: string;
}

export default function SubjectWordsList({ subject }: SubjectWordsListProps) {
  const [words, setWords] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/subject/${subject}?page=${page}&limit=${limit}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch words");

        setWords(data.words || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching subject words:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchWords();
  }, [subject, page, limit]);

  if (loading) return <div className="p-4">Loading words...</div>;

  return (
    <div className="space-y-6">
      {words.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      )}

      {words.length > 0 ? (
        words.map((word) => (
          <SubjectWordDetailsDisplay key={word.word} data={word} />
        ))
      ) : (
        <p>No words found for this subject.</p>
      )}

      {words.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      )}
    </div>
  );
}
