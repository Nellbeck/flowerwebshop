"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar"; // Import the Navbar
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission (In real case, send data to an API)
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Hide confirmation after 3s
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 container mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold text-center text-black">Contact Us</h2>
        <p className="text-center text-gray-600 mt-2">We&apos;d love to hear from you!</p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 bg-gray-100 p-6 rounded-md shadow-md">
          <label className="block mb-2 text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 text-gray-700 font-medium">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4 h-32"
          />

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Send Message
          </button>

          {submitted && <p className="mt-4 text-green-600 text-center">Message sent! ✅</p>}
        </form>
      </main>

    <Footer></Footer>
    </div>
  );
}
