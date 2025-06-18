'use client';
import SubjectWordsList from "@/components/SubjectWordList";
// import { useParams } from "next/navigation";
import { useParams } from 'next/navigation';

export default function SubjectPage() {
  const params = useParams();
  const subject = params.subject as string;
  const parts = subject.split('-');
  const formattedSubject = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Words for: {formattedSubject}
      </h1>
      {subject ? (
        <SubjectWordsList subject={subject} />
      ) : (
        <p>No subject selected.</p>
      )}
    </div>
  );
}
