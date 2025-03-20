"use client";
import { useState, useEffect } from "react";

export default function AdminUpload() {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(""); // ✅ Store image file name
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState(""); // ✅ New state for description
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  async function handleUpload() {
    if (!image) return alert("Please select an image.");
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.imageUrl) {
      setImageUrl(data.imageUrl);
      alert("Image uploaded successfully!");
    } else {
      alert("Image upload failed.");
    }
  }

  async function handleSave() {
    if (!name || !price || !stock || !imageUrl || !description) {
      return alert("Please fill all fields.");
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/products/${editId}` : "/api/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock, imageUrl, description }), // ✅ Send description
    });

    if (res.ok) {
      setEditId(null);
      setName("");
      setPrice("");
      setStock("");
      setDescription(""); // ✅ Clear description field
      setImageUrl("");
      alert(editId ? "Product updated!" : "Product added!");
      window.location.reload();
    } else {
      alert("Failed to save product.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("Product deleted.");
      setProducts(products.filter((p) => p.Id !== id));
    } else {
      alert("Delete failed.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg text-black">
      <h1 className="text-3xl font-bold mb-4">Admin - Manage Products</h1>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block font-semibold">Upload Image:</label>
        <input
          type="file"
          className="hidden"
          id="fileInput"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImageName(e.target.files[0]?.name || ""); // ✅ Store file name
          }}
        />
        <label htmlFor="fileInput" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md inline-block">
          Choose Image
        </label>
        <button onClick={handleUpload} className="ml-2 bg-green-500 text-white py-2 px-4 rounded-md">
          Upload
        </button>

        {/* ✅ Show Image Name */}
        {imageName && <p className="text-sm mt-2">Selected File: {imageName}</p>}
        {imageUrl && <p className="text-sm mt-2">Image uploaded successfully!</p>}
      </div>

      {/* Product Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="border p-2 rounded w-full" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (SEK)" className="border p-2 rounded w-full" />
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock Quantity" className="border p-2 rounded w-full" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product Description" className="border p-2 rounded w-full h-20" />
      </div>
      <button onClick={handleSave} className="w-full bg-purple-500 text-white py-2 rounded-md">
        {editId ? "Update Product" : "Add Product"}
      </button>

      {/* Product List */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Existing Products</h2>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.Id} className="border p-4 rounded-lg flex items-center justify-between">
            {/* Image */}
            <img src={product.ImageUrl} alt={product.Name} className="w-20 h-20 object-cover rounded-lg mr-4" />
            {/* Product Info */}
            <div className="flex-1">
              <p className="font-bold">{product.Name}</p>
              <p className="text-gray-600">{product.Description}</p> {/* ✅ Show description */}
              <p>{product.Price} SEK - Stock: {product.Stock}</p>
            </div>
            {/* Buttons */}
            <div>
              <button
                onClick={() => {
                  setEditId(product.Id);
                  setName(product.Name);
                  setPrice(product.Price);
                  setStock(product.Stock);
                  setDescription(product.Description); // ✅ Load description into form
                  setImageUrl(product.ImageUrl);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(product.Id)} className="bg-red-500 text-white px-3 py-1 rounded-md">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
