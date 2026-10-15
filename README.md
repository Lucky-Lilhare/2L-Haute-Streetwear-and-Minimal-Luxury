# 2L — Haute Streetwear & Minimal Luxury

> A full-stack, luxury streetwear e-commerce platform featuring an interactive storefront, customer account center with loyalty tiers, an administrative atelier portal, and bulk CSV product import capabilities.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
* **Architectural Streetwear Aesthetics:** Dark obsidian palette (`#08080A`), typography, and micro-interactions.
* **Curated Collections:** Drop lookbooks, heavyweight boxy tees, raw selvedge denim, and chunky runner footwear.
* **Multi-Facet Catalog Filters:** Filter by category, silhouette, gender, price slider, sizing, and featured sorts.
* **Interactive Cart & Checkout:** Fly-out cart drawer, coupon codes, and a step-by-step checkout modal with real-time order tracking.
* **Global Tools:** Interactive Quick Search (⌘K), Size Guide Modal (Inches & CM), Multi-Currency Selector (INR, USD, EUR, GBP, JPY), and Shipping Policy Modals.

### 👤 Customer Account & Authentication
* **Sign In & Sign Up Modals:** Accessible from the Navbar user icon or direct navigation to `/account`.
* **1-Click Demo Login:** Instant testing with the built-in `Adrian Vance` profile without typing credentials.
* **Noir VIP Loyalty Program:** Tier points progress tracker, early drop access, and welcome points on registration.
* **Account Center (`/account`):** View past orders with step-by-step courier timelines, address book manager, and saved wishlist.
* **Session Management:** Secure log out from both the top navigation bar and account profile settings.

### 👑 Host Atelier Admin Portal (`/admin`)
* **Host Security Gate:** Restricted by master credentials.
* **Manual Product Creation:** Real-time piece configuration with preset image asset selectors and category mapping.
* **Bulk Import Products (CSV):**
  * Built-in RFC 4180 CSV parser supporting quoted text, newlines, and commas.
  * Downloadable pre-formatted CSV template with realistic streetwear sample pieces.
  * Drag-and-drop CSV upload zone with file stats and type checking.
  * Interactive pre-import validation table (flags missing fields, negative stock, invalid pricing, and duplicate SKUs).
  * Spreadsheet formula injection protection (neutralizing `=`, `+`, `-`, `@`).
  * Real-time progress bar, live database dispatch, and immediate synchronization with the storefront catalog.
* **Issue & Support Ticket Management:** Track, update, and resolve customer exchange or delivery issues.
* **Live Orders & Metrics:** Total revenue, active inventory stock levels, and order fulfillment status updates.

### 🔌 Backend REST API Server
* Built with Node.js & Express using a clean MVC (Model-View-Controller) structure.
* Mongoose models for `User`, `Product`, `Order`, `Cart`, `Wishlist`, and `Issue`.
* JWT token authentication with bcrypt password hashing and `hostAuth` administrator middleware.
* Offline-resilient fallback: Front-end stays 100% interactive using local persistence even if MongoDB is not running locally.

---

## 🚀 Getting Started & Local Setup

Follow these step-by-step instructions to run the project in your local terminal.

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (Version 18.0 or higher recommended)
* `npm` (bundled with Node.js)
* (Optional) [MongoDB Community Server](https://www.mongodb.com/try/download/community) if you wish to run a local database daemon.

---

### 2. Clone the Repository

Open your terminal and clone the repository:

```bash
git clone https://github.com/Lucky-Lilhare/2L-Haute-Streetwear-and-Minimal-Luxury.git
cd 2L-Haute-Streetwear-and-Minimal-Luxury
```

---

### 3. Install Dependencies

Install root, backend, and frontend packages:

```bash
# Install root and backend dependencies
npm install

# Install frontend dependencies
cd Frontend
npm install
cd ..
```

---

### 4. Configure Environment Variables

Create your backend environment configuration:

```bash
# In the project root, copy the example file:
cp Backend/.env.example Backend/.env
```

*(On Windows PowerShell, use: `copy Backend\.env.example Backend\.env`)*

The default configuration in `Backend/.env` works out-of-the-box for local development:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/2l_clothing
JWT_SECRET=2L_SUPER_SECRET_HAUTE_STREETWEAR_JWT_KEY_2026
JWT_EXPIRE=30d
HOST_MASTER_KEY=2L-HOST-2026
```

---

### 5. Run the Project

You will need **two terminal tabs/windows**:

#### **Terminal 1: Start the Backend REST API Server**
From the project root:
```bash
node Backend/server.js
```
* The backend server will start on: **`http://localhost:5000`**
* Health check: **`http://localhost:5000/api/health`**

#### **Terminal 2: Start the Frontend Client**
From the project root:
```bash
cd Frontend
npm run dev
```
* The client will compile and start on: **`http://localhost:5173/`**

---

## 🔑 Access Links & Default Credentials

| Service | URL | Default Credentials |
| :--- | :--- | :--- |
| **Storefront** | [http://localhost:5173/](http://localhost:5173/) | Public access |
| **Admin Portal** | [http://localhost:5173/admin](http://localhost:5173/admin) | **Username:** `Admin@122`<br>**Password:** `Bucchi@1225` |
| **Customer Sign In** | [http://localhost:5173/account](http://localhost:5173/account) | Click **"⚡ 1-Click Demo Login"**<br>*(or `adrian.vance@atelier-2l.com` / `password123`)* |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | Public & Authenticated Endpoints |

---

## 📁 Project Directory Structure

```text
2L-Haute-Streetwear-and-Minimal-Luxury/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/             # Request handlers
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── productController.js  # Catalog & Bulk CSV creation
│   │   ├── orderController.js    # Order lifecycle management
│   │   └── issueController.js    # Customer support tickets
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & hostAuth middleware
│   │   └── error.js              # Centralized error handler
│   ├── models/                   # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/                   # Express route definitions
│   ├── server.js                 # Server entry point & CORS configuration
│   └── .env.example              # Environment variable template
│
├── Frontend/
│   ├── public/                   # Static icons and default imagery
│   ├── src/
│   │   ├── components/
│   │   │   ├── account/          # Customer AccountPage & Sign In/Sign Up portal
│   │   │   ├── admin/            # AdminPortal (Manual Entry & Bulk CSV Import)
│   │   │   ├── cart/             # CartDrawer, CheckoutModal, OrderSuccessModal
│   │   │   ├── catalog/          # CatalogPage, FilterSidebar, ProductCard
│   │   │   ├── common/           # Navbar, Footer, AuthModal, QuickSearch, Toast
│   │   │   ├── home/             # HeroBanner, Carousels, CategoryGrid
│   │   │   └── pdp/              # ProductDetailPage with interactive options
│   │   ├── context/
│   │   │   └── StoreContext.jsx  # Centralized React state & LocalStorage sync
│   │   ├── data/
│   │   │   └── products.js       # Base catalog data & user profiles
│   │   ├── utils/
│   │   │   ├── csvImporter.js    # RFC 4180 CSV parser & template generator
│   │   │   └── testBulkImport.js # Automated unit tests for bulk import
│   │   ├── App.jsx               # Main application router & modal mounts
│   │   ├── index.css             # Tailwind CSS & custom animations
│   │   └── main.jsx              # React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore                    # Excludes node_modules, dist, and .env files
├── package.json                  # Root scripts
└── README.md                     # Project documentation
```

---

## 🛠️ Testing & Quality Assurance

To execute the automated unit test suite for CSV importing, numeric validations, and formula injection sanitization:

```bash
node Frontend/src/utils/testBulkImport.js
```

To build the frontend for production:

```bash
cd Frontend
npm run build
```

---

## 📄 License
This project is for demonstration and portfolio use. All rights reserved by **2L Atelier**.
