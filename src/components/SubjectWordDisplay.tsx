"use client";

import { useEffect, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

interface Worddata {
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
  positivePrompt?: string;
  negativePrompt?: string;
  imageURL?: string;
}

const colorOptions = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-purple-100",
];

export default function SubjectWordDetailsDisplay({ data }: { data: Worddata }) {
  
  const [colorClass, setColorClass] = useState("");

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
  
    // If voices aren't loaded yet, wait and retry
    if (!voices.length) {
      synth.onvoiceschanged = () => speak(text);
      return;
    }
  
    // Prefer a female English voice
    const preferredVoices = voices.filter(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("google us") ||
          v.name.toLowerCase().includes("karen") || // macOS/AU
          v.name.toLowerCase().includes("zoe") ||    // common female voices
          v.name.toLowerCase().includes("linda") ||
          v.name.toLowerCase().includes("ava"))
    );
  
    const voice = preferredVoices[0] || voices.find((v) => v.lang.startsWith("en")) || null;
  
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
  
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  useEffect(() => {
    const randomColor =
      colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorClass(randomColor);
  }, []);

  

 
  return (
    <div className={`max-w-5xl my-10 mx-10 text-gray-600 p-8 md:p-8 md:mx-auto rounded-3xl ${colorClass}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold capitalize text-gray-600 ">
          {data.word}
        </h1>
        <button
          onClick={() => speak(data.word)}
          className="text-gray-600"
          aria-label="Listen"
        >
          <FaVolumeUp size={24} />
        </button>
      </div>

      {data.pronunciation && (
        <p className="italic mt-2 text-gray-600 ">/{data.pronunciation}/</p>
      )}

      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        {/* Left: Image */}
        {data.imageURL && (
          <div className="w-full lg:w-1/2">
            <img
              src={data.imageURL}
              alt={data.word}
              className="w-full rounded-2xl shadow-md object-cover aspect-square"
            />
          </div>
        )}

        {/* Right: Word Info */}
        <div className="w-full lg:w-1/2 space-y-4">
          {data.meaning && (
            <div>
              <h2 className="text-xl font-semibold">Meaning</h2>
              <p>{data.meaning}</p>
            </div>
          )}

          {data.partOfSpeech && (
            <div>
              <h2 className="text-xl font-semibold">Part of Speech</h2>
              <p>{data.partOfSpeech}</p>
            </div>
          )}

          {data.wordForms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Word Forms</h2>
              <p>{data.wordForms.join(", ")}</p>
            </div>
          )}

          {data.exampleSentence && (
            <div>
              <h2 className="text-xl font-semibold">Example</h2>
              <p className="italic">“{data.exampleSentence}”</p>
            </div>
          )}

          {data.synonyms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Synonyms</h2>
              <p>{data.synonyms.join(", ")}</p>
            </div>
          )}

          {data.antonyms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Antonyms</h2>
              <p>{data.antonyms.join(", ")}</p>
            </div>
          )}

          {data.memoryTrick && (
            <div>
              <h2 className="text-xl font-semibold">Memory Trick</h2>
              <p>{data.memoryTrick}</p>
            </div>
          )}

          {data.origin && (
            <div>
              <h2 className="text-xl font-semibold">Origin</h2>
              <p>{data.origin}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
