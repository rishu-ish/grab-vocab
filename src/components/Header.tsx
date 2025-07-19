"use client";
import { JSX, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import grabvocab from "../../public/image.png";
import didYouMean from "didyoumean";
import words from "an-array-of-english-words";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import "@/theme/theme";
import { navItems } from "@/data";
import { FaShareAlt, FaUserCircle, FaBookOpen } from "react-icons/fa";
import { MdQuiz, MdGrade } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiBookAlt } from "react-icons/bi";
import { BsBookHalf } from "react-icons/bs";
import { GiBookmarklet } from "react-icons/gi";
const dictionaryWords = words;

const iconMap: { [key: string]: JSX.Element } = {
  "Social Media": <FaShareAlt className="inline mr-2" />,
  "Login / Signup": <FaUserCircle className="inline mr-2" />,
  Logout: <FiLogOut className="inline mr-2" />,
  "About Us": <AiOutlineInfoCircle className="inline mr-2" />,
  "Dictionary A-Z": <BiBookAlt className="inline mr-2" />,
  Quiz: <MdQuiz className="inline mr-2" />,
  Grades: <MdGrade className="inline mr-2" />,
  Exam: <GiBookmarklet className="inline mr-2" />,
  Subject: <BsBookHalf className="inline mr-2" />,
};

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: session } = useSession();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser || session?.user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);
  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };
  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const corrected = didYouMean(trimmedQuery, dictionaryWords);
    if (corrected && corrected !== trimmedQuery) {
      if (confirm(`Did you mean '${corrected}'?`)) {
        setQuery("");
        setSuggestions([]);
        router.push(`/word/${corrected}`);
        return;
      }
    }
    setQuery("");
    setSuggestions([]);
    router.push(`/word/${trimmedQuery}`);
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
        console.log("Error fetching suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [query]);

  const handleSelectSubject = (value: string, type: "subject" | "grades") => {
    router.push(`/${type}/${value}`);
  };

  const handleBlur = () => {
    // Delay clearing suggestions to allow `onMouseDown` to process
    setTimeout(() => setSuggestions([]), 100);
  };

  const topButtons = [
    "Social Media",
    isLoggedIn ? "Logout" : "Login / Signup",
    "About Us",
  ];

  return (
    <header
      className="top-0 z-50 shadow-md border-b"
      style={{
        backgroundColor: "var(--background-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col px-4 py-3 gap-3">
        <h1
          className="text-4xl font-bold text-center text-accent cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => router.push("/")}
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--accent-color)",
          }}
        >
          <Image
            src={grabvocab}
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto"
            style={{ borderColor: "var(--border-color)" }}
          />
          GrabVocab
        </h1>

        <div className="flex justify-end flex-wrap gap-3 px-3">
          {topButtons.map((label) => (
            <HeaderButton key={label} label={label} />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6">
        {/* Search Bar */}

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 pb-4">
          {navItems.map((item) =>
            typeof item === "string" ? (
              <HeaderButton key={item} label={item} />
            ) : (
              <div
                key={item.label}
                className="relative"
                ref={(el) => {
                  dropdownRefs.current[item.label] = el;
                }}
              >
                <div onClick={() => toggleDropdown(item.label)}>
                  <HeaderButton label={item.label} />
                </div>

                {openDropdown === item.label && (
                  <div
                    ref={(el) => {
                      dropdownRefs.current[item.label] = el;
                    }}
                    className="absolute mt-2 w-48 rounded-xl shadow-xl z-20 border overflow-hidden"
                    style={{
                      backgroundColor: "var(--background-color)",
                      color: "var(--primary-text-color)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {item.dropdown.map((subItem) => (
                      <div
                        key={subItem.value}
                        onMouseDown={() => {
                          handleSelectSubject(
                            subItem.value,
                            item.label.toLowerCase() as "subject" | "grades"
                          );
                          setOpenDropdown(null);
                        }}
                        className="px-5 py-3 text-sm cursor-pointer hover:bg-accent hover:text-white transition-all"
                        style={{
                          color: "var(--primary-text-color)",
                        }}
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
        <form
          onSubmit={handleSearch}
          className="flex-1 relative w-full px-3 pb-4"
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search words..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
              className="w-full px-5 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--primary-text-color)",
                borderColor: "var(--border-color)",
              }}
            />
            <FaSearch
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              style={{ color: "var(--primary-text-color)" }}
            />

            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute left-0 w-full mt-2 rounded-lg shadow-lg z-50 overflow-hidden"
                style={{
                  backgroundColor: "var(--background-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                {suggestions.map((word, index) => (
                  <li
                    key={word + index}
                    onMouseDown={() => {
                      setQuery("");
                      setSuggestions([]);
                      router.push(`/word/${word}`);
                    }}
                    className="px-5 py-3 text-sm cursor-pointer hover:bg-accent/10 transition-colors"
                    style={{
                      color: "var(--primary-text-color)",
                    }}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}

function HeaderButton({ label }: { label: string }) {
  const router = useRouter();

  const handleClick = () => {
    if (label === "Logout") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("user-updated"));
      signOut({ callbackUrl: "/" });
      return;
    }

    if (label === "Login / Signup") router.push("/auth");
    else if (label === "Dictionary A-Z") router.push("/dictionary");
    else if (label === "Quiz") router.push("/quiz/select");
    else if (label === "Social Media") router.push("/share");
    else if (label === "About Us") router.push("/about");
    else console.log(`Clicked on ${label}`);
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm px-4 py-2 rounded-full border transition hover:bg-accent hover:text-white"
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--primary-text-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <span>
        {iconMap[label]}
        {label}
      </span>
    </button>
  );
}
