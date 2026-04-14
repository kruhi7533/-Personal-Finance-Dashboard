# 🌊 FinFlow — Premium Full-Stack Finance Ecosystem

FinFlow is a high-fidelity personal finance management platform engineered with the **MERN (Next.js, Express, React, Node, MongoDB)** stack. It offers an obsidian-dark, data-rich environment for tracking wealth, analyzing cash flow, and managing financial health with high precision.

The platform is fortified with **Role-Based Access Control (RBAC)**, ensuring a secure and specialized experience for both administrators and personal users.

---

## 🚀 Key Features

- **Dynamic Dashboard:** Real-time visualization of Total Balance, Income, Expenses, and Savings Rate.
- **Intelligent Insights:** Spending pattern analysis with interactive Chart.js visualizations.
- **Transaction Ledger:** Advanced sorting, filtering, and global search across financial histories.
- **RBAC Security:** Separate entry points and permissions for Admins and Regular Users.
- **PDF & CSV Export:** Generate professional financial reports on demand.
- **Admin Panel:** Specialized view for platform-wide metrics and user management.

---

## 🛠️ Technology Stack

### Frontend (Next.js 14 App Router)
- **Framework:** React 18, Next.js 14
- **Styling:** Tailwind CSS (Modern Dark Theme)
- **Charts:** Chart.js with React-Chartjs-2
- **State:** React Context API (Auth, Theme, Transactions)
- **Icons:** Lucide-React

### Backend (Node.js & Express)
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (JSON Web Tokens) with HttpOnly logic
- **Security:** BcryptJS for robust password hashing
- **Middleware:** Custom RBAC & Auth guards

---

## 📂 Project Architecture

```text
.
├── app/                # Next.js App Router (Frontend Pages & Layouts)
├── components/         # Reusable UI components (Modals, Charts, Sidebar)
├── context/            # Global State (AuthContext, TransactionContext)
├── lib/                # Shared Utilities (API client, Formatters)
├── server/             # Express Backend API
│   ├── config/         # MongoDB Connection logic
│   ├── controllers/    # Route handler logic
│   ├── models/         # Database Schemas (User, Transaction)
│   ├── routes/         # API Endpoint definitions
│   └── seed.js         # Initial Database Seeder script
└── tailwind.config.js  # Global Styling Configuration
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js:** v18+ recommended
- **MongoDB:** Ensure MongoDB is running locally (typically `mongodb://localhost:27017`)

### 2. Backend Configuration
Navigate to the `server` folder and set up your environment:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/finflow
JWT_SECRET=your_secure_secret_key
```

### 3. Database Seeding
Initialize the database with demo accounts:
```bash
node seed.js
```

### 4. Running the Application
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
# In the project root
npm install
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🛡️ RBAC & Demo Access

Use the following credentials after running the seeder:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@finflow.com` | `admin123` |
| **User** | `sakshi@finflow.com` | `user123` |

### Permission Matrix
- **Users:** Can manage own transactions, view personal insights, and export reports.
- **Admins:** Full CRUD on users, platform-wide transaction oversight, and global financial metrics.

---
*Developed with a focus on visual excellence and premium user experience.*
