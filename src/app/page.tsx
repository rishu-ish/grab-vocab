import WordOfTheDay from "@/components/WordOfTheDay";

export default function Home() {
  return (
    <main className="text-gray-900 p-6 md:p-16 flex flex-col items-center overflow-x-hidden">
      <WordOfTheDay />
    </main>
  );
}
