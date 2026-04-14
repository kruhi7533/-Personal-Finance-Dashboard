# FinFlow — Full-Stack Personal Finance Dashboard with RBAC

FinFlow is a premium, high-fidelity personal finance management platform built with the **MERN (Next.js, Express, React, Node, MongoDB)** stack. It provides deep insights into individual wealth trends, spending patterns, and cash flow analysis, all secured by a robust **Role-Based Access Control (RBAC)** system.

The application features a sleek "Obsidian" dark aesthetic with lime-green brand accents, optimized for both functionality and visual excellence.

---

## 🎯 Project Overview
FinFlow is a complete full-stack solution for personal finance, focusing on three core pillars:
1.  **Visual Clarity:** Advanced charts and metrics for instantaneous financial health assessments.
2.  **Data Ledger:** A high-precision transaction history with advanced filtering, sorting, and pagination.
3.  **Secure RBAC:** A server-enforced permission system distinguishing between Admin and User roles.
4.  **Persistent Storage:** Real-time data synchronization with MongoDB.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization:** [Chart.js](https://www.chartjs.org/) & [React Chartjs 2](https://react-chartjs-2.js.org/)
- **State Management:** React Context API (Auth, Transactions, Theme)
- **Icons:** [Lucide-React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [JWT (JSON Web Tokens)](https://jwt.io/)
- **Security:** [Bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing

---

## 📂 Folder Structure
```text
.
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable UI components (Sidebar, Topbar, Modals)
├── context/            # Auth, Transaction, and Theme Contexts
├── lib/                # Shared utilities (API client, formatters, exports)
├── server/             # Express.js Backend
│   ├── config/         # Database configuration
│   ├── controllers/    # API logic handlers
│   ├── middleware/     # Auth and RBAC guards
│   ├── models/         # Mongoose schemas (User, Transaction)
│   ├── routes/         # API endpoint definitions
│   └── seed.js         # Database initialization script
└── public/             # Static assets
```

---

## 🏗️ Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on `mongodb://localhost:27017`.

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # IMPORTANT: Creates the initial admin/user accounts
npm start        # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
# In the root directory
npm install
npm run dev      # Starts Next.js on http://localhost:3000
```

---

## 🛡️ Role-Based Access Control (RBAC)

FinFlow implements a hierarchical permission system:

| Feature | Admin | User |
|---------|:---:|:---:|
| View Personal Dashboard | ✅ | ✅ |
| Manage Own Transactions | ✅ | ✅ |
| View All Platform Transactions | ✅ | ❌ |
| Manage All User Transactions | ✅ | ❌ |
| Admin Panel (Site Metrics) | ✅ | ❌ |
| User Management (Promote/Delete) | ✅ | ❌ |

---

## 🔑 Demo Credentials

After running `npm run seed`, use these accounts to explore the RBAC features:

### 🛡️ Admin Account
- **Email:** `admin@finflow.com`
- **Password:** `admin123`

### 👤 Regular User
- **Email:** `sakshi@finflow.com`
- **Password:** `user123`

---

## ✨ Features List

- **Unified Dashboard:** Real-time metrics for Balance, Income, Expense, and Savings Rate.
- **Transaction Ledger:** Advanced filtering, global search, and pagination.
- **PDF Export:** High-fidelity financial reports generated on the fly.
- **Financial Insights:** AI-powered suggestions based on spending patterns.
- **Platform Analytics:** (Admin Only) High-level overview of total users and site-wide cash flow.
- **User Management:** (Admin Only) Secure tools for managing the user base.

---
*Developed as a premium full-stack FinFlow Design Overhaul.*
