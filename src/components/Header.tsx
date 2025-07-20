"use client";
import { JSX, useEffect, useRef, useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import grabvocab from "../../public/image.png";
import didYouMean from "didyoumean";
import words from "an-array-of-english-words";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import "@/theme/theme";
import { buttonColorMap, navItems } from "@/data";
import { FaShareAlt, FaUserCircle } from "react-icons/fa";
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
  const [user, setUser] = useState();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: session } = useSession();

  useEffect(() => {
    const handleUserUpdate = (e: any) => {
      const updatedUser = e.detail;
      setUser(updatedUser);
      setIsLoggedIn(true);
    };

    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser);
        setUser(parsedUser as any);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user:", err);
        setUser(undefined);
        setIsLoggedIn(false);
      }
    } else if (session?.user) {
      setUser(session.user as any);
      setIsLoggedIn(true);
    } else {
      setUser(undefined);
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
    "About Us",
    isLoggedIn ? "Logout" : "Login / Signup",
  ];

  return (
    <header className="top-0 z-50 shadow-md border-b bg-[#FFF5EC] border-[#F2E0D0]">
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
        {isLoggedIn && (
          <div
            className="flex items-center justify-end gap-2 text-sm text-right px-3 pb-1 font-medium"
            style={{ color: "var(--accent-color)" }}
          >
            <FaUser className="text-base" style={{ color: "var(--accent-color)" }} />
            <span className="px-3 py-1 rounded-full border text-[#4dabf7] bg-[#e6f4ff] border-[#b5dcff] font-semibold">
              {(user as any)?.username || (user as any)?.name || (user as any)?.email}
            </span>
          </div>
        )}
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
          <div className="md:hidden flex justify-end px-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-2xl text-accent"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
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
                    className="absolute mt-2 w-48 rounded-xl shadow-xl z-20 border border-[#FFDDD6] bg-white text-[#3a3a3a]"
                  >
                    <div >

                      {/* <div
                        ref={(el) => {
                          dropdownRefs.current[item.label] = el;
                        }}
                        className="absolute mt-2 w-48 rounded-xl shadow-xl z-20 border overflow-hidden"
                        style={{
                          backgroundColor: "var(--background-color)",
                          color: "var(--primary-text-color)",
                          borderColor: "var(--border-color)",
                        }}
                      > */}
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
                          className="px-5 py-3 hover:bg-[#ffbaba] hover:text-white transition-colors"
                        >
                          {subItem.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  // </div>
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
              // className="w-full px-5 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--primary-text-color)",
                borderColor: "var(--border-color)",
              }}
              className="w-full px-5 py-2 rounded-full border border-[#ffd6d6] shadow-sm focus:ring-2 focus:ring-[#ff6b6b] bg-white text-[#333]"

            />
            <FaSearch
              onClick={handleSearch}
              style={{ color: "var(--primary-text-color)" }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff6b6b]" />

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
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          className="absolute top-0 left-0 h-full w-64 bg-[#FFF5EC] shadow-lg p-6 border-r border-[#f2d4c0]">
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-neutral-900 shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--background-color)",
              color: "var(--primary-text-color)",
              borderRight: "1px solid var(--border-color)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-xl">✕</button>
            </div>

            <div className="space-y-4">
              {navItems.map((item) =>
                typeof item === "string" ? (
                  <HeaderButton key={item} label={item} />
                ) : (
                  item.dropdown.map((subItem) => (
                    <button
                      key={subItem.value}
                      onClick={() => {
                        setDrawerOpen(false);
                        router.push(`/${item.label.toLowerCase()}/${subItem.value}`);
                      }}
                      className="block w-full text-left px-4 py-2 rounded hover:bg-accent hover:text-white transition"
                      style={{
                        backgroundColor: "var(--background-color)",
                        color: "var(--primary-text-color)",
                      }}
                    >
                      {subItem.label}
                    </button>
                  ))
                )
              )}
              {topButtons.map((label) => (
                <HeaderButton key={label} label={label} />
              ))}
            </div>
          </div>
        </div>
      )}
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

  const styles =
    buttonColorMap[label as keyof typeof buttonColorMap] ||
    "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded-full border transition font-medium ${styles}`}
    >
      <span className="flex items-center gap-1">
        {iconMap[label]}
        {label}
      </span>
    </button>
  );
}
