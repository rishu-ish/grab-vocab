"use client";

import { useState } from "react";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";
import Image from "next/image";

export default function SharePage() {
  const [word, setWord] = useState("anachronism");
  const [meaning, setMeaning] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const shareText = `📚 Today I learned: ${word}\n\n${meaning}\n\nvia GrabVocab.com`;
  const shareUrl = `https://grab-vocab-1.vercel.app/word/${word.toLowerCase()}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    alert("Copied to clipboard!");
  };

  const fetchWordDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/define/${word}`);
      const data = await res.json();

      if (data.result && data.result.word) {
        setWord(data.result.word || word);
        setMeaning(data.result.meaning || "No meaning found.");
        setImageURL(data.result.imageURL || "");
      } else {
        setMeaning("Word not found.");
      }
    } catch (err) {
      console.error("Error fetching word:", err);
      setMeaning("Failed to fetch word details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📤 Share Your Learning</h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Word"
        />
        <button
          onClick={fetchWordDetails}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Fetch Word Details
        </button>
        <textarea
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Meaning"
          rows={3}
        />
        <input
          type="text"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Image URL (optional)"
        />
      </div>

      {!loading && (
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          {imageURL && (
            <Image
              src={imageURL}
              alt={word}
              width={400}
              height={250}
              className="mx-auto rounded mb-4"
            />
          )}
          <h2 className="text-xl font-semibold">{word}</h2>
          <p className="text-gray-600 mb-4">{meaning}</p>

          <div className="flex justify-center gap-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}&quote=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook size={24} />
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:text-sky-700"
            >
              <FaTwitter size={24} />
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                shareText + "\n" + shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
            >
              <FaWhatsapp size={24} />
            </a>

            <button
              onClick={copyToClipboard}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaLink size={24} />
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
    </div>
  );
}
