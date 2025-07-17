"use client";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import grabvocab from "../../public/image.png";
import didYouMean from "didyoumean";
import words from "an-array-of-english-words";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut, FiShare2 } from "react-icons/fi";

const dictionaryWords = words;

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };
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

  const handleSelectSubject = (value: string, type: "subject" | "grades") => {
    router.push(`/${type}/${value}`);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setSuggestions([]), 100);
  };
  const navItems = [
    {
      label: "Subject",
      dropdown: [
        { label: "English Literature", value: "english-literature" },
        { label: "Geography", value: "geography" },
        { label: "History", value: "history" },
        { label: "Chemistry", value: "chemistry" },
        { label: "Biology", value: "biology" },
        { label: "Physics", value: "physics" },
        { label: "Mathematics", value: "mathematics" },
        { label: "Psychology", value: "psychology" },
        { label: "Sociology", value: "sociology" },
        { label: "Political Science", value: "political-science" },
        // Add more subjects as needed
      ], // dropdown items
    },
    {
      label: "Grades",
      dropdown: [
        { label: "Grade 1", value: "grade-1" },
        { label: "Grade 2", value: "grade-2" },
        { label: "Grade 3", value: "grade-3" },
        { label: "Grade 4", value: "grade-4" },
        { label: "Grade 5", value: "grade-5" },
        { label: "Grade 6", value: "grade-6" },
        { label: "Grade 7", value: "grade-7" },
        { label: "Grade 8", value: "grade-8" },
        { label: "Grade 9", value: "grade-9" },
        { label: "Grade 10", value: "grade-10" },
        { label: "Grade 11", value: "grade-11" },
        { label: "Grade 12", value: "grade-12" },
      ], // dropdown items
    },
    "Quiz",
    "Dictionary A-Z",
    {
      label: "Exam",
      dropdown: [
        { label: "PCAT", value: "pcat" },
        { label: "ACT", value: "act" },
        { label: "SAT", value: "sat" },
        { label: "PSAT", value: "psat" },
        { label: "MCAT", value: "mcat" },
        { label: "CPA", value: "cpa" },
        { label: "GED", value: "ged" },
        { label: "TOEFL", value: "toefl" },
        { label: "AP", value: "ap" },
        { label: "NMSQT", value: "nmsqt" },
        { label: "BAR", value: "bar" },
        { label: "USMLE", value: "usmle" },
        { label: "LSAT", value: "lsat" },
        { label: "DAT", value: "dat" },
        { label: "GMAT", value: "gmat" },
        { label: "NCLEX", value: "nclex" },
        { label: "NCLEX PN", value: "nclex-pn" },
        { label: "GRE", value: "gre" },
      ], // dropdown items
    },
  ];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setIsLoggedIn(true);
        } catch {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    loadUser();
    window.addEventListener("user-updated", loadUser);
    return () => window.removeEventListener("user-updated", loadUser);
  }, []);

  const topButtons = ["Social Media"];
  topButtons.push("Login / Signup");

  if (isLoggedIn) {
    topButtons.push("Logout");
  } else {
  }

  topButtons.push("About Us");
  return (
    <header className="top-0 z-50 bg-slate-200 shadow-md border-b">
      {/* Top Section */}
      <div className="flex flex-col px-4 py-3 gap-3">
        <h1
          className="text-4xl text-gray-900 font-bold text-center text-accent cursor-pointer"
          onClick={() => router.push("/")}
          style={{ fontFamily: "initial" }}
        >
          <Image
            src={grabvocab}
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto border"
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
            <div key={item.label} className="relative" ref={dropdownRef}>
              <div onClick={() => toggleDropdown(item.label)}>
                <HeaderButton label={item.label} />
              </div>

              {openDropdown === item.label && (
                <div className="absolute text-slate-600 bg-white shadow-md rounded mt-1 z-10">
                  {item.dropdown.map((subItem) => (
                    <div
                      key={subItem.value}
                      onMouseDown={() =>
                        handleSelectSubject(
                          subItem.value,
                          item.label.toLowerCase() as "subject" | "grades"
                        )
                      }
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                    >
                      {subItem.label}
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
  const [user, setUser] = useState<{ username: string } | null>(null);
  const { data: session } = useSession();

  const isLoggedIn = !!user || !!session?.user;
  const isLoginButton = label === "Login / Signup";
  const isLogoutButton = label === "Logout";

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("user-updated", loadUser);
    return () => window.removeEventListener("user-updated", loadUser);
  }, []);

  const handleClick = () => {
    if (isLogoutButton) {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("user-updated"));
      signOut({ callbackUrl: "/" }); // Also handles Google logout
      return;
    }

    if (isLoginButton && isLoggedIn) {
      alert(`Welcome!, ${user?.username || session?.user?.name}!`);
      return;
    }

    if (label === "Dictionary A-Z") router.push("/dictionary");
    else if (label === "Login / Signup") router.push("/auth");
    else if (label === "Quiz") router.push("/quiz/select");
    else if (label === "Social Media") router.push("/share");
    else if (label === "Test") router.push("/test");
    else if (label === "About Us") router.push("/about");
    else console.log(`Clicked on ${label}`);
  };

  const showLabel =
    isLoginButton && (user || session)
      ? user?.username || session?.user?.name
      : label;

  const colorClasses: Record<string, string> = {
    "Social Media": "bg-sky-100 text-sky-800  hover:bg-sky-500",
    "Login / Signup": "bg-green-100 text-green-800  hover:bg-green-500",
    Logout: "bg-red-100 text-red-800  hover:bg-red-500",
    "About Us": "bg-yellow-100 text-yellow-800  hover:bg-yellow-500",
    Subject: "bg-indigo-100 text-indigo-800  hover:bg-indigo-500",
    Grades: "bg-pink-100 text-pink-800  hover:bg-pink-500",
    Quiz: "bg-rose-100 text-rose-800  hover:bg-rose-500",
    "Dictionary A-Z": "bg-orange-100 text-orange-800  hover:bg-orange-500",
    Test: "bg-purple-100 text-purple-800  hover:bg-purple-500",
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded-full border border-muted transition flex items-center gap-2 ${
        colorClasses[label] || "bg-gray-100 text-black hover:bg-gray-600"
      }`}
    >
      {showLabel}
      {isLogoutButton && <FiLogOut className="text-lg" />}
      {label === "Social Media" && <FiShare2 className="text-lg" />}
    </button>
  );
}
