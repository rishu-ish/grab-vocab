"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import React from "react";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");

    // Wait for session to load
    if (status === "loading") return;

    const isLocalUser = !!stored;
    const isGoogleUser = !!session?.user?.email;

    if (isLocalUser || isGoogleUser) {
      router.replace("/"); // redirect to home
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email,
      password,
      ...(isLogin ? {} : { username }),
    };

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("user-updated"));
        router.push("/");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Auth request failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login to GrabVocab" : "Create an Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-indigo-600 hover:underline"
          >
            {isLogin ? "Sign up here" : "Login here"}
          </button>
        </p>
        <button
          type="button"
          onClick={() => signIn("google")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 my-4 rounded-lg hover:bg-red-600 transition"
        >
          <FaGoogle className="text-lg" />
          {loading ? "Signing in with Google..." : "Sign in with Google"}
        </button>
        <button
          type="button"
          onClick={() => signIn("facebook")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 my-4 rounded-lg hover:bg-blue-600 transition"
        >
          <FaFacebook className="text-lg" />
          {loading ? "Signing in with facebook..." : "Sign in with facebook"}
        </button>
      </div>
    </div>
  );
}
