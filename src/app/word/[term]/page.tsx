// app/word/[term]/page.tsx
import WordDetailsDisplay from "@/components/WordDetailsDisplay";

export default function WordResultPage({ params }: { params: { term: string } }) {
  return <WordDetailsDisplay term={params.term} />;
}