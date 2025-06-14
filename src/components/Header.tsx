"use client";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import grabvocab from "../../public/grabvocab.jpeg";
import didYouMean from "didyoumean";
import words from "an-array-of-english-words";
import { useRouter } from "next/navigation";
import Image from "next/image";

const dictionaryWords = words;

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [subject] = useState("Subject");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };
  // useEffect(() => {
  //   const savedSubject = localStorage.getItem("selectedSubject");
  //   if (savedSubject) setSubject(savedSubject);
  // }, []);
  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const corrected = didYouMean(trimmedQuery, dictionaryWords);
    console.log("Corrected:", corrected);
    if (corrected && corrected !== trimmedQuery) {
      if (confirm(`Did you mean '${corrected}'?`)) {
        setQuery("");
        setSuggestions([]);
        router.push(`/word/${corrected}`); // ✅ Go to WordDetails
        return;
      }
    }
    setQuery("");
    setSuggestions([]);
    router.push(`/word/${trimmedQuery}`); // ✅ Go to WordDetails
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        const data = await res.json();
        setSuggestions(data.slice(0, 5).map((item: any) => item.word));
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [query]);

  const handleSelectSubject = (subItem: string) => {
    // localStorage.setItem("selectedSubject", subItem);
    // setSubject(subItem); // ✅ This updates the label dynamically
    router.push(`/subject/${subItem}`);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setSuggestions([]), 100);
  };
  const navItems = [
    {
      label: "Subject",
      dropdown: [
        "English",
        "Geography",
        "History",
        "Chemistry",
        "Biology",
        "Physics",
        "Mathematics",
        "Psychology",
        "Sociology",
        "Political",
      ], // dropdown items
    },
    "Grades",
    "Quiz",
    "Dictionary A-Z",
    "Test",
  ];
  const topButtons = ["Social Media", "Login / Signup", "About Us"];

  return (
    <header className="top-0 z-50 bg-slate-200 shadow-md border-b">
      {/* Top Section */}
      <div className="flex flex-col px-4 py-3 gap-3">
        <h1
          className="text-4xl text-amber-50 font-bold text-center text-accent cursor-pointer"
          onClick={() => router.push("/")}
          style={{ fontFamily: "initial" }}
        >
          <Image
            src={grabvocab}
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto rounded-full border"
          />
          GrabVocab
        </h1>

        <div className="flex justify-end flex-wrap gap-3 px-3">
          {topButtons.map((label) => (
            <HeaderButton key={label} label={label} />
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="px-6 pb-4">
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search words..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={handleBlur}
            className="w-full px-5 py-3 rounded-full border border-muted bg-white  text-black "
          />
          <FaSearch
            onClick={handleSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-accent cursor-pointer"
          />

          {suggestions.length > 0 && (
            <ul
              ref={suggestionsRef}
              className="absolute left-0 w-full bg-white  border border-muted mt-2 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {suggestions.map((word, index) => (
                <li
                  key={word + index}
                  onMouseDown={() => {
                    setQuery("");
                    setSuggestions([]);
                    router.push(`/word/${word}`);
                  }}
                  className="px-5 py-3 text-sm text-black  hover:bg-slate-100  transition-colors cursor-pointer"
                >
                  {word}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {/* Navigation */}
      <nav className="flex flex-wrap gap-3 px-6 pb-4">
        {navItems.map((item) =>
          typeof item === "string" ? (
            <HeaderButton key={item} label={item} />
          ) : (
            <div key={item.label} className="relative">
              <div onClick={() => toggleDropdown(item.label)}>
                <HeaderButton label={subject || item.label} />
              </div>

              {openDropdown === item.label && (
                <div
                  className="absolute text-slate-600 bg-white shadow-md rounded mt-1 z-10"
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.dropdown.map((subItem) => (
                    <div
                      key={subItem}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                      onClick={() => handleSelectSubject(subItem)}
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </nav>
    </header>
  );
}

function HeaderButton({ label }: { label: string }) {
  const router = useRouter();
  const colorClasses: Record<string, string> = {
    "Social Media": "bg-sky-100 text-sky-800  hover:bg-sky-500",
    "Login / Signup": "bg-green-100 text-green-800  hover:bg-green-500",
    "About Us": "bg-yellow-100 text-yellow-800  hover:bg-yellow-500",
    Subject: "bg-indigo-100 text-indigo-800  hover:bg-indigo-500",
    Grades: "bg-pink-100 text-pink-800  hover:bg-pink-500",
    Quiz: "bg-rose-100 text-rose-800  hover:bg-rose-500",
    "Dictionary A-Z": "bg-orange-100 text-orange-800  hover:bg-orange-500",
    Test: "bg-purple-100 text-purple-800  hover:bg-purple-500",
  };

  const handleClick = () => {
    if (label === "Dictionary A-Z") {
      router.push("/allWords");
    } else if (label === "Login / Signup") {
      router.push("/auth");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded-full border border-muted transition ${
        colorClasses[label] || "bg-gray-100 text-black hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
