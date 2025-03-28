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
  }, [router]);

  const handleLogin = async () => {  
    // Send the password to your API for validation
    const res = await fetch("/api/admin-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
  
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin/upload");
      } else {
        alert("Incorrect password. Try again.");
      }
    } else {
      alert("Error checking password.");
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
