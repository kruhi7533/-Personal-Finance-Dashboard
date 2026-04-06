# FinFlow — High-Fidelity Personal Finance Dashboard

FinFlow is a premium, high-fidelity personal finance management platform built to provide deep insights into individual wealth trends, spending patterns, and cash flow analysis. The application features a sleek "Obsidian" dark aesthetic with lime-green brand accents, optimized for both functionality and visual excellence.

---

## 🎯 Project Overview
FinFlow was developed as a complete rebuild of the personal finance experience, focusing on three core pillars:
1.  **Visual Clarity:** Advanced charts and metrics for instantaneous financial health assessments.
2.  **Data Ledger:** A high-precision transaction history with advanced filtering, sorting, and pagination.
3.  **Actionable Insights:** Automated derivation of spending habits and savings trends to drive better financial decisions.

---

## 🛠️ Tech Stack
- **Framework:** [React](https://reactjs.org/) (Vite)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a custom obsidian/lime color palette.
- **Typography:** **Manrope** (Headlines) and **Inter** (Body) for a premium, modern feel.
- **Data Visualization:** [Chart.js](https://www.chartjs.org/) and [React Chartjs 2](https://react-chartjs-2.js.org/).
- **Icons:** [Feather Icons](https://feathericons.com/) / Lucide-React SVG components.
- **Routing:** React Router DOM (v6+).

---

## 📂 Folder Structure
```text
src/
├── components/
│   ├── common/         # Reusable low-level UI elements
│   ├── layout/         # Sidebar, Topbar, and App structure
│   └── transactions/   # Add/Edit Modal and specific txn components
├── constants/          # Category definitions and brand tokens
├── context/            # Global State (RoleContext & TransactionContext)
├── data/               # Mock transactional records for initial state
├── pages/              # Main view layers (Dashboard, Transactions, Insights)
├── utils/              # Modular helpers (Aggregations, Formatters, CSV Export)
└── App.jsx             # Main application entry and routing
```

---

## 🏗️ Setup Instructions
To run FinFlow locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/finflow-dashboard.git
    cd finflow-dashboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **Access the application:**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features List

### 1. Unified Dashboard
- **Metric Cards:** Total Balance, Monthly Income, Monthly Expense, and Savings Rate.
- **Balance Trend:** A gradient-filled line chart showing net wealth growth over 6 months.
- **Spending Allocation:** A doughnut chart visualizing top expense groups (e.g., Housing, Food).
- **Recent Movements:** A quick-glance list of the latest 3 transaction records.

### 2. Transaction Ledger
- **Advanced Filtering:** Filter by Type (Income/Expense), Category, or specific Month.
- **Global Search:** Real-time search across the entire transaction database.
- **Pagination:** Handles large datasets with a clean, 8-row per-page ledger.
- **CSV Export:** One-click download of filtered transaction records for external use.

### 3. Financial Insights
- **Core Stats:** Deep dives into Top Spending Category, Best Savings Month, and Average Spend.
- **Historical Analysis:** A 5-month vertical income vs. expense cash flow table.
- **AI-Powered Suggestions:** Automated insights derived from spending spikes (e.g., highlighting large rent payments or savings goals).
- **Performance detail:** Investment yield trend lines and debt ratio monitoring.

### 4. Admin vs. Viewer Roles
FinFlow implements a robust **Role-Based UI (RBAC)**:
- **Admin Role:** Full CRUD access. Can add new assets, edit existing transactions, and delete records.
- **Viewer Role:** Read-only access. Forbidden from accessing the "Add Transaction" modal and editing/deleting any ledger data.
- **Context-Switching:** Use the topbar profile badge to instantly toggle roles for testing.

---

## 🛡️ State Management & Utilities
- **Centralized State:** Uses `TransactionContext` for a truly global, reactive transaction list.
- **Derived Logic:** All metrics (Inflow, Outflow, Net Flow) are calculated using high-performance `useMemo` hooks to ensure zero layout lag.
- **Modular Utilities:** Complex logic is extracted into `src/utils/` for better maintainability:
    - `aggregations.js`: Calculation engine for monthly and category totals.
    - `formatters.js`: High-fidelity currency (₹ INR) and date formatting.

---

## 📝 Assumptions Made
- **Currency:** Focused on Indian Rupee (₹) formatting to match regional high-fidelity requirements.
- **Mock Data:** Initial data is statically provided in `mockData.js` to ensure immediate functional demonstration.
- **Deployment:** Assumes a modern browser environment with support for CSS Flex/Grid and modern JS (ES6+).

---
*Developed with ❤️ as part of the FinFlow Design Overhaul Assignment.*
