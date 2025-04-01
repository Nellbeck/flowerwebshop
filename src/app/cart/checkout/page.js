"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import * as turf from "@turf/turf";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const now = new Date();
    if (now.getHours() >= 12) {
      setIsTodayDisabled(true);
    }
  }, []);  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    }
  }, []);

  const totalSum = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);

  const router = useRouter();

  // Base origin for delivery (latitude, longitude)
  const baseOrigin = [17.0553866, 61.3033484];

  const getCurrentTime = () => {
    const now = new Date();
    return { hours: now.getHours(), minutes: now.getMinutes() };
  };

  // Generate the min available date based on current time
  const getMinDate = () => {
    const today = new Date();
    const currentTime = getCurrentTime();

    if (
      (deliveryOption === "delivery" && currentTime.hours >= 12) ||
      (deliveryOption === "pickup" && currentTime.hours >= 17)
    ) {
      today.setDate(today.getDate() + 1); // Move to next day if too late
    }

    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Check if the selected date is a Sunday
  const isSunday = (date) => {
    const day = new Date(date).getDay();
    return day === 0; // 0 = Sunday
  };

  // Function to update stock of the products
  const updateProductStock = async (cart) => {
    try {
      const updateRequests = cart.map((product) => {
        const newStock = product.Stock - product.quantity;
        return fetch(`/api/products/${product.Id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: newStock }),
        });
      });

      await Promise.all(updateRequests);
    } catch (error) {
      console.error("Failed to update product stock:", error);
    }
  };

// Function to convert address to coordinates using OpenStreetMap Nominatim API
const getCoordinates = async (address, city, postalCode) => {
    // Construct query with street and postal code only
    let query = `${address}, ${postalCode}`;
    let url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${encodeURIComponent(query)}&format=jsonv2&limit=1`;
  
    try {
      let response = await fetch(url);
      let data = await response.json();
  
      if (data && data.length > 0) {
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      }
      console.log("No coordinates found for the address.");
      return null; // No coordinates found
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };
  
  const getDeliveryFee = (distance) => {
    if (distance <= 2) return 99;
    if (distance <= 4) return 129;
    if (distance <= 7) return 139;
    if (distance <= 12) return 149;
    return null; // No delivery if distance > 12 km
  };
  
  const isWithinDeliveryArea = async (address, city, postalCode) => {
    const coordinates = await getCoordinates(address, city, postalCode);
    if (!coordinates) return { withinDelivery: false, fee: null };
  
    const userLocation = turf.point(coordinates);
    const baseLocation = turf.point(baseOrigin);
    const distance = turf.distance(userLocation, baseLocation, { units: "kilometers" });
  
    const deliveryFee = getDeliveryFee(distance);
    return { withinDelivery: deliveryFee !== null, fee: deliveryFee };
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedDate) {
      setErrorMessage("Vänligen välj ett datum.");
      setIsSubmitting(false);
      return;
    }

    if (isSunday(selectedDate)) {
      setErrorMessage("Söndagar är inte tillgängliga för leverans.");
      setIsSubmitting(false);
      return;
    }

    if (deliveryOption === "delivery") {
      const { withinDelivery, fee } = await isWithinDeliveryArea(address, city, postalCode);
      if (!withinDelivery) {
        setErrorMessage("Sorry, your address is outside the delivery area.");
        setIsSubmitting(false);
        return;
      }
      setDeliveryFee(fee); // Store the fee for order summary
    }

    try {
      // Add the order to the database
      const orderData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        address: address,
        city: city,
        postalCode: postalCode,
        totalAmount: totalSum,
        orderStatus: "Processing",  
        deliveryMethod: deliveryOption,
        isHomeDelivery: deliveryOption === "delivery",
        pickUpDeliveryDate: selectedDate,
        items: cart,
      };

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        throw new Error('Error placing order');
      }

      const orderResult = await orderResponse.json();
      const orderId = orderResult.orderId;

      // Update the product stock
      await updateProductStock(cart);

      // Send confirmation email
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          cart,
          totalSum,
          orderId
        }),
      });

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);

      alert("Purchase successful! Order confirmation has been sent.");
      router.push("/");
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("There was an error processing your order. Please try again.");
    }

    setIsSubmitting(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#abc1a9]">
      <Navbar />

      <main className="text-black container mx-auto py-8 flex-grow">
        <h1 className="font-bold text-center text-2xl text-black m-10">Kassa</h1>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-lg text-black mb-2" htmlFor="name">Namn</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-black mb-2" htmlFor="address">Adress</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* City & Postal Code */}
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block text-lg text-black mb-2" htmlFor="city">Ort</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg text-black mb-2" htmlFor="postalCode">Postnummer</label>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Error message for invalid delivery area */}
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}

          <div className="mb-4">
            <label className="block text-lg text-black mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-black mb-2" htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-black mb-2">Leveransalternativ</label>
            <div className="flex space-x-4">
            <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="pickup"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                  className="mr-2"
                />
                Hämta i butik
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="delivery"
                  checked={deliveryOption === "delivery"}
                  onChange={async () => {
                    setDeliveryOption("delivery");
                    const { withinDelivery, fee } = await isWithinDeliveryArea(address, city, postalCode);
                    if (!withinDelivery) {
                      setErrorMessage("Sorry, your address is outside the delivery area.");
                      setDeliveryFee(0);
                    } else {
                      setErrorMessage("");
                      setDeliveryFee(fee);
                    }
                  }}
                  className="mr-2"
                />
                Hemleverans
              </label>
            </div>
          </div>
          {/* Delivery Date Selection */}
          <div className="mb-4">
            <label className="block text-lg text-black mb-2" htmlFor="date">
              Välj leverans-/upphämtningsdatum
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              min={getMinDate()} // Set minimum date based on time
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-black">Order Summering</h2>
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.Id} className="flex justify-between text-black">
                  <span>{item.Name} (x{item.quantity})</span>
                  <span>{(item.Price * item.quantity).toFixed(2)} SEK</span>
                </li>
              ))}
            </ul>

            {/* Display Home Delivery Fee if selected */}
            {deliveryOption === "delivery" && (
              <div className="mt-2 flex justify-between text-black">
                <span>Hemleverans:</span>
                <span>{deliveryFee.toFixed(2)} SEK</span>
              </div>
            )}

            <div className="mt-4 flex justify-between font-bold text-black">
              <span>Total:</span>
              <span>{(totalSum + (deliveryFee || 0)).toFixed(2)} SEK</span>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Purchase"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
