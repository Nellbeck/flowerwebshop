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
    try {
      const res = await fetch("/api/admin-password", {
        method: "GET",
        headers: {
          "x-secret-key": process.env.NEXT_PUBLIC_SECRET_API_KEY, 
        },
      });
  
      if (!res.ok) {
        alert("Unauthorized access");
        return;
      }
  
      const data = await res.json();
      if (password === data.password) {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin/upload");
      } else {
        alert("Incorrect password. Try again.");
      }
    } catch (error) {
      console.error("Error fetching password:", error);
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
