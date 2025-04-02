# 🌸 Flower Webshop  

A modern webshop for ordering flowers with home delivery or in-store pickup. Built using **Next.js**, **React**, and **Azure** services.  

## 📖 Table of Contents  
- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Functionality](#functionality)  
- [Database Schema](#database-schema)  
- [API Endpoints](#api-endpoints)  
- [Deployment](#deployment)  
- [Future Improvements](#future-improvements)  

---

## 🌼 Overview  
This is a flower webshop where customers can browse products, add items to their cart, and choose between **home delivery** or **in-store pickup**. The app ensures that deliveries are only available within a set radius and dynamically generates **Swish QR codes** for payments. The admin panel allows store owners to manage products and orders.  

---

## ✨ Features  
### **Customer Side**  
✅ Browse flower arrangements and bouquets  
✅ Add items to the shopping cart  
✅ Choose between **home delivery** or **in-store pickup**  
✅ Delivery validation (checks if the address is within a **10km radius**)  
✅ Generate **Swish QR codes** for payments  

### **Admin Panel**  
✅ Secure login for store management  
✅ **Product Management**: Upload, edit, and remove products  
✅ **Order Management**: View and filter orders by **delivery method**, **status**, and **date**  
✅ **Stock Management**: Track product availability  

---

## 🛠 Tech Stack  
### **Frontend**  
- [Next.js](https://nextjs.org/) (React framework)  
- Tailwind CSS (styling)  

### **Backend**  
- Next.js API Routes  
- Azure SQL Database  
- Azure Blob Storage (for product images)  

### **Payments**  
- Swish API (QR code-based payments)  

### **Mapping & Delivery Validation**  
- [OpenStreetMap (Nominatim)](https://nominatim.org/)  
- [Turf.js](https://turfjs.org/)  

---

## ⚙ Functionality  
### **1️⃣ Product Management**  
Admins can:  
- Upload product images to **Azure Blob Storage**  
- Store product details (name, price, stock) in the database  
- Edit and remove products  

### **2️⃣ Shopping Cart**  
- Products added to the cart are stored in **local storage** (expires after 1 hour)  
- Customers can proceed to checkout  

### **3️⃣ Delivery & Pickup**  
- **Home delivery** is only available within a **12km radius** (validated with OpenStreetMap & Turf.js)  
- **In-store pickup** is available for all dates except **past dates**, **Sundays**, and **the current day after 17:00**  

### **4️⃣ Orders**  
- Every order is stored in the **Orders** table  
- Admins can filter orders by **delivery method**, **status**, and **pickup/delivery date**  

### **5️⃣ Payments (Swish API)**  
- The system generates a **Swish QR code** based on the total price  
- Customers scan the QR code using their Swish app to complete payment  

---

## 📊 Database Schema  
### **Products Table (`dbo.Products`)**  
| Column      | Type         | Description                    |  
|------------|-------------|--------------------------------|  
| `Id`       | `INT (PK)`   | Unique product ID             |  
| `Name`     | `VARCHAR`    | Product name                  |  
| `Price`    | `DECIMAL`    | Product price                 |  
| `ImageUrl` | `VARCHAR`    | URL to product image          |  
| `Stock`    | `INT`        | Available quantity            |  
| `CreatedAt`| `DATETIME`   | Timestamp when added          |  

### **Orders Table (`dbo.Orders`)**  
| Column               | Type         | Description                    |  
|----------------------|-------------|--------------------------------|  
| `OrderId`           | `INT (PK)`   | Unique order ID                |  
| `CustomerName`      | `VARCHAR`    | Name of the customer           |  
| `CustomerEmail`     | `VARCHAR`    | Email of the customer          |  
| `CustomerPhone`     | `VARCHAR`    | Phone number                   |  
| `Address`           | `VARCHAR`    | Delivery address               |  
| `City`             | `VARCHAR`    | City of delivery               |  
| `PostalCode`       | `VARCHAR`    | Postal code                    |  
| `TotalAmount`      | `DECIMAL`    | Total price of the order       |  
| `DeliveryMethod`   | `VARCHAR`    | "Home Delivery" or "Pickup"    |  
| `PickUpDeliveryDate` | `DATE`       | Scheduled pickup/delivery date |  
| `OrderStatus`      | `VARCHAR`    | "Pending", "Completed", etc.   |  
| `CreatedAt`        | `DATETIME`   | Timestamp of order             |  

---

## 🔌 API Endpoints  
### **📦 Products**  
- `GET /api/products` → Fetch all products  
- `POST /api/products` → Add a new product  
- `PUT /api/products/:id` → Update a product  
- `DELETE /api/products/:id` → Delete a product  

### **🛒 Orders**  
- `GET /api/orders` → Fetch all orders  
- `POST /api/orders` → Create a new order  
- `GET /api/orders?delivery=home` → Fetch only home delivery orders  

### **📸 Image Upload**  
- `POST /api/upload` → Upload an image to **Azure Blob Storage**  

---

## 🚀 Deployment  
The app is hosted on **Azure App Service**, with:  
- **Frontend & API**: Deployed as a **Next.js** application  
- **Database**: Hosted on **Azure SQL**  
- **Images**: Stored in **Azure Blob Storage**  

---

