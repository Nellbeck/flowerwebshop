"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showHomeDelivery, setShowHomeDelivery] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      router.replace("/admin"); // Redirect to login if not admin
    } else {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (showHomeDelivery) {
        setOrders(data.filter(order => order.IsHomeDelivery));
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, [showHomeDelivery]);

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg text-black">
      <h1 className="text-3xl font-bold mb-4">Admin - Orders</h1>
      
      {/* Button to navigate to Admin Upload */}
      <button
        onClick={() => router.push('/admin/upload')}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Go to Product Upload
      </button>

      {/* Toggle Home Delivery Orders */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showHomeDelivery}
            onChange={() => setShowHomeDelivery(prev => !prev)}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span className="ml-2 text-lg">Show Home Delivery Orders Only</span>
        </label>
      </div>
    
      {/* Orders Table */}
      <div className="overflow-x-auto w-full">
            <table className="min-w-full table-auto mb-6">
            <thead>
                <tr className="bg-gray-100">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Postal Code</th>
                <th className="px-4 py-2">Total Amount</th>
                <th className="px-4 py-2">Delivery Method</th>
                <th className="px-4 py-2">Order Status</th>
                <th className="px-4 py-2">Order Date</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                <tr key={order.OrderId} className="border-b">
                    <td className="px-4 py-2">{order.OrderId}</td>
                    <td className="px-4 py-2">{order.CustomerName}</td>
                    <td className="px-4 py-2">{order.CustomerEmail}</td>
                    <td className="px-4 py-2">{order.CustomerPhone}</td>
                    <td className="px-4 py-2">{order.Address}</td>
                    <td className="px-4 py-2">{order.City}</td>
                    <td className="px-4 py-2">{order.PostalCode}</td>
                    <td className="px-4 py-2">{order.TotalAmount}</td>
                    <td className="px-4 py-2">{order.DeliveryMethod}</td>
                    <td className="px-4 py-2">{order.OrderStatus}</td>
                    <td className="px-4 py-2">{new Date(order.CreatedAt).toLocaleString()}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default AdminOrders;


