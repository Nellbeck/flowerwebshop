"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    if (localStorage.getItem("isAdmin") === "true") {
      router.push("/admin/upload");
    }
  }, []);

  const handleLogin = () => {
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD; // Change this!
    if (password === correctPassword) {
      localStorage.setItem("isAdmin", "true"); // Store admin status
      router.push("/admin/upload"); // Redirect to the upload page
    } else {
      alert("Incorrect password. Try again.");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
