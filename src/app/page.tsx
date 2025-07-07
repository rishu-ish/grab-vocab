import AppInstallPrompt from "@/components/AppInstallationPrompt";
import SafariInstallBanner from "@/components/SafariInstallBanner";
import WordOfTheDay from "@/components/WordOfTheDay";

export default function Home() {
  const isIosSafari =
    /iPhone|iPad|iPod/.test(navigator.userAgent) &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return (
    <main className="text-gray-900 p-6 md:p-16 flex flex-col items-center overflow-x-hidden">
      <AppInstallPrompt />
      {!isIosSafari && <SafariInstallBanner />}
      <WordOfTheDay />
    </main>
  );
}
