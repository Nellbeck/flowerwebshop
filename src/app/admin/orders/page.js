"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showHomeDelivery, setShowHomeDelivery] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [columnsVisible, setColumnsVisible] = useState(false); // To toggle column filters visibility
  const [columns, setColumns] = useState({
    orderId: true,
    customerName: true,
    customerEmail: true,
    customerPhone: true,
    address: true,
    city: true,
    postalCode: true,
    totalAmount: true,
    deliveryMethod: true,
    orderStatus: true,
    createdAt: true,
    productName: true,
    quantity: true,
    priceAtPurchase: true,
  });
  const router = useRouter();

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
      
      // Filter data based on showHomeDelivery state
      if (showHomeDelivery) {
        setOrders(data.filter(order => order.IsHomeDelivery));
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, [showHomeDelivery]);

  // Toggle column visibility
  const handleToggleColumnVisibility = () => {
    setColumnsVisible(prevState => !prevState);
  };

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

      {/* Button to toggle column visibility */}
      <button
        onClick={handleToggleColumnVisibility}
        className="bg-gray-500 text-white py-2 px-4 rounded-md mb-4"
      >
        {columnsVisible ? "Hide Columns Filter" : "Show Columns Filter"}
      </button>

      {/* Show checkboxes to filter columns if columnsVisible is true */}
      {columnsVisible && (
        <div className="mb-4">
          <h3 className="text-xl mb-2">Select Columns to Show</h3>
          <div className="flex flex-wrap gap-4">
            {Object.keys(columns).map((column) => (
              <label key={column} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={columns[column]}
                  onChange={() =>
                    setColumns((prevColumns) => ({
                      ...prevColumns,
                      [column]: !prevColumns[column],
                    }))
                  }
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-2 text-lg capitalize">{column.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto mb-6">
          <thead>
            <tr className="bg-gray-100">
              {columns.orderId && <th className="px-4 py-2">Order ID</th>}
              {columns.customerName && <th className="px-4 py-2">Customer Name</th>}
              {columns.customerEmail && <th className="px-4 py-2">Email</th>}
              {columns.customerPhone && <th className="px-4 py-2">Phone</th>}
              {columns.address && <th className="px-4 py-2">Address</th>}
              {columns.city && <th className="px-4 py-2">City</th>}
              {columns.postalCode && <th className="px-4 py-2">Postal Code</th>}
              {columns.totalAmount && <th className="px-4 py-2">Total Amount</th>}
              {columns.deliveryMethod && <th className="px-4 py-2">Delivery Method</th>}
              {columns.orderStatus && <th className="px-4 py-2">Order Status</th>}
              {columns.createdAt && <th className="px-4 py-2">Order Date</th>}
              {columns.productName && <th className="px-4 py-2">Product Name</th>}
              {columns.quantity && <th className="px-4 py-2">Quantity</th>}
              {columns.priceAtPurchase && <th className="px-4 py-2">Price at Purchase</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.OrderId} className="border-b">
                {columns.orderId && <td className="px-4 py-2">{order.OrderId}</td>}
                {columns.customerName && <td className="px-4 py-2">{order.CustomerName}</td>}
                {columns.customerEmail && <td className="px-4 py-2">{order.CustomerEmail}</td>}
                {columns.customerPhone && <td className="px-4 py-2">{order.CustomerPhone}</td>}
                {columns.address && <td className="px-4 py-2">{order.Address}</td>}
                {columns.city && <td className="px-4 py-2">{order.City}</td>}
                {columns.postalCode && <td className="px-4 py-2">{order.PostalCode}</td>}
                {columns.totalAmount && <td className="px-4 py-2">{order.TotalAmount}</td>}
                {columns.deliveryMethod && <td className="px-4 py-2">{order.DeliveryMethod}</td>}
                {columns.orderStatus && <td className="px-4 py-2">{order.OrderStatus}</td>}
                {columns.createdAt && <td className="px-4 py-2">{new Date(order.CreatedAt).toLocaleString()}</td>}
                
                {columns.productName && (
                  <td className="px-4 py-2">
                    {order.OrderItems.map(item => (
                      <div key={item.ProductName}>{item.Name}</div>
                    ))}
                  </td>
                )}

                {columns.quantity && (
                  <td className="px-4 py-2">
                    {order.OrderItems.map(item => (
                      <div key={item.ProductName}>{item.Quantity}</div>
                    ))}
                  </td>
                )}

                {columns.priceAtPurchase && (
                  <td className="px-4 py-2">
                    {order.OrderItems.map(item => (
                      <div key={item.ProductName}>{item.PriceAtPurchase}</div>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

