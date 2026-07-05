













# Sri Krishna Engineering (SKE) - Full-Stack E-Commerce & Management Portal

Welcome to the **Sri Krishna Engineering (SKE)** repository. This project is a comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) application designed to serve as both an e-commerce storefront for customers and a powerful management portal for administrators. 

It is built with a focus on modern aesthetics, responsiveness, and AI-driven insights to streamline operations and enhance the shopping experience.

---

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite for ultra-fast development and build times.
- **Styling:** Tailwind CSS + Custom CSS for responsive, modern, and highly customized UI components.
- **Animations:** Framer Motion for smooth micro-interactions, page transitions, and dynamic UI feedback.
- **Routing:** React Router v7 with protected route handling and role-based access.
- **State Management & Data Fetching:** Context API (Auth, Cart, Language contexts) and Axios for API requests.
- **Charts & Visualization:** Recharts for rendering analytics dashboards.
- **Icons:** Lucide React for consistent and crisp SVG iconography.
- **Markdown Parsing:** Marked for rendering rich text (e.g., from AI insights).

### Backend (Server)
- **Runtime & Framework:** Node.js with Express.js.
- **Database:** MongoDB with Mongoose ODM for flexible schema modeling.
- **Authentication:** JSON Web Tokens (JWT) and Bcrypt for secure password hashing.
- **File Uploads:** Multer for handling product image uploads.
- **Payment Gateway:** Razorpay integration for processing orders securely.
- **Emails:** Nodemailer for transactional emails (e.g., contact leads, order updates).
- **AI Integration:** Groq SDK for generating AI-powered business insights and powering the chatbot widget.
- **Validation:** Express-Validator for input sanitization and verification.

---

## ✨ Features Overview

The platform is strictly divided into functional areas based on the user's role: **Visitor**, **Customer**, and **Admin**.

### 1. General & Public Features (Visitors)
- **Dynamic Home Page:** A visually stunning landing page showcasing featured products, services, and company information.
- **Product Catalog:** A comprehensive product browsing page (`/products`) with filtering, searching, and sorting capabilities.
- **Product Details:** Individual product pages featuring high-quality images, descriptions, pricing, stock status, and add-to-cart functionality.
- **Multilingual Support:** Built-in localization (English and Tamil) allowing users to toggle language preferences for a localized shopping experience.
- **Contact & Lead Generation:** A robust contact form that stores leads directly into the database and triggers email notifications.
- **AI Chatbot Widget:** A globally accessible chatbot powered by the Groq SDK to assist visitors with inquiries in real-time.
- **Authentication:** Secure Registration and Login flows to convert visitors into customers.

### 2. Customer Features (Authenticated Users)
- **Customer Dashboard:** A personalized landing area summarizing recent activity.
- **Shopping Cart & Checkout:** 
  - Dynamic cart sidebar and dedicated cart page.
  - Seamless checkout flow integrated with **Razorpay** for secure payments.
- **Order Management:** Customers can view their entire order history, track statuses, and view specific order details.
- **Wishlist:** Users can save favorite products to their wishlist for future purchase.
- **Profile Management:** Update personal information, shipping addresses, and account details.
- **Restock Requests:** If a product is out of stock, customers can trigger a 'Restock Request' modal to be notified when inventory arrives.

### 3. Administrator Features (Admin Role)
Admins have access to a secure, comprehensive management portal.
- **Admin Dashboard:** High-level overview of store performance.
- **Product Management (CRUD):** 
  - Add new products with rich text descriptions and image uploads.
  - Edit existing inventory, update prices, and manage stock levels.
  - Delete discontinued products.
- **Order Processing:** View all incoming orders, update their fulfillment status (e.g., Processing, Shipped, Delivered), and manage transactions.
- **User Management:** View registered users, track their activity, and manage permissions.
- **Advanced Analytics:** Interactive charts and graphs powered by Recharts, showing revenue trends, top-selling products, and user engagement metrics.
- **AI Insights Generation:** A specialized feature utilizing the Groq SDK to analyze store data (sales, product performance, restock requests) and generate actionable, strategic business insights directly within the admin panel.

---

## 📂 Project Structure

```text
SKE/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Nav, Footer, Cards, Chatbot, etc.)
│   │   ├── context/        # React Contexts (Auth, Cart, Language)
│   │   ├── layouts/        # Layout wrappers (VisitorLayout, DashboardLayout)
│   │   ├── pages/          # Individual route components (Home, Cart, AdminProducts, etc.)
│   │   └── translations/   # i18n JSON files (e.g., ta.json for Tamil)
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB connection and config files
│   ├── controllers/        # Route logic and business rules
│   ├── models/             # Mongoose schemas (User, Product, Order, ContactLead, RestockRequest)
│   ├── routes/             # Express API routers (auth, products, orders, ai, payment, etc.)
│   ├── uploads/            # Static directory for uploaded product images
│   ├── .env.example        # Environment variable template
│   ├── server.js           # Main application entry point
│   └── seed.js             # Database seeding utility
│
└── package.json            # Root configuration (handles concurrent script execution)
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (Local or Atlas cluster)
- API Keys: Razorpay (for payments) and Groq (for AI features)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SKE
```

### 2. Install Dependencies
Install dependencies for the root, client, and server simultaneously:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Environment Variables
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Razorpay Config
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AI Config
GROQ_API_KEY=your_groq_api_key

# Email Config (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Run the Application
You can run both the client and server concurrently from the root directory using:
```bash
npm run dev
```
- The frontend will start at `http://localhost:5173`
- The backend API will start at `http://localhost:5000`

---

## 🔌 API Routes Summary

Here is a high-level overview of the exposed REST endpoints:

- **`/api/auth`**: `POST /register`, `POST /login`, `GET /me`
- **`/api/products`**: `GET /` (all), `GET /:id`, `POST /` (Admin), `PUT /:id` (Admin), `DELETE /:id` (Admin)
- **`/api/orders`**: `POST /` (checkout), `GET /myorders` (Customer), `GET /` (Admin), `PUT /:id/status` (Admin)
- **`/api/payment`**: Endpoints to generate Razorpay order IDs and verify payment signatures.
- **`/api/users`**: Endpoints for Admin to manage user accounts.
- **`/api/upload`**: `POST /` for uploading files to local storage via Multer.
- **`/api/ai`**: Endpoints calling Groq SDK for chatbot responses and admin insights.
- **`/api/analytics`**: Endpoints returning aggregated data (sales, user counts) for the Admin Recharts dashboards.
- **`/api/contact`**: Endpoints to submit and retrieve contact leads.
- **`/api/translate`**: Handles dynamic translation requests if not handled entirely client-side.

---

*This README was automatically generated to document the complete architecture and features of the Sri Krishna Engineering portal.*
