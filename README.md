<p align="center">
  <img src="./frontend/assets/SUJOY%20MOULICK.jpeg" alt="Sujoy Moulick Logo" width="150" height="150" style="border-radius: 50%; border: 2px solid rgba(255,255,255,0.1);" />
</p>

<h1 align="center">Sujoy Moulick Portfolio & Workspace</h1>

<p align="center">
  A state-of-the-art, premium full-stack portfolio website and administrative backend workspace designed to manage freelance clients, track project progress logs, generate clean invoices, and monitor server latency metrics in real-time.
</p>

---

## 🏗️ Architecture & Project Structure

The project is split into two peer directories to separate concerns and prepare for standalone deployments:

```
PORTFOLIO/
├── frontend/             # Vite + React Client SPA
│   ├── src/
│   │   ├── admin/        # Glassmorphic Admin Dashboard Pages
│   │   ├── pages/        # Public Client-Facing Portfolio Views
│   │   ├── components/   # UI elements (Timelines, Modals, SEO)
│   │   └── lib/          # Utilities & API wrappers
│   ├── public/           # Static site assets (Favicon, SEO manifests)
│   └── package.json
│
└── backend/              # Node.js + Express REST API
    ├── src/
    │   ├── db.ts         # MongoDB Atlas client initializer
    │   ├── routes.ts     # API Endpoints (CRUD, Analytics, Auth)
    │   └── monitor.ts    # Response timer middleware
    ├── scripts/          # Backup & Restore scripts
    └── package.json
```

---

## ⚡ Key Core Features

### 1. Client & Freelance Billing Panel
- **Client Records**: Register clients with contact information, payment terms, and custom currency profiles.
- **Invoice Generator**: Automated billing supporting invoice number counters, custom prefixes, tax terms, and line-item tables. Exports to a clean, text-based PDF invoice optimized for printing (free of mock accounts and clutter).
- **Financial Trackers**: Visual logging of incoming payments and business expenses. Includes a multi-chart financial analytics board to monitor growth and revenues.

### 2. Active Projects & Working Logs
- **Internal Projects**: Planning, revisions, active tracking, and budget accounting for client-billing projects.
- **Current Working Projects (Logs)**: A public log showing your current side projects, SaaS research, and experiments. Includes status filters (e.g., *In Progress*, *Researching*), 0-100% interactive progress tracks, and a sleek glassmorphic details overlay modal on click.

### 3. Public Contributions Form
- Public viewers of your live apps and working logs can click **Contribute** to submit code/design collaboration proposals.
- Submissions capture the contributor's name, email, GitHub handle, proposal description, and target project. Proposals are stored securely in the database and reviewed via the admin panel.

### 4. Real-Time Connectivity Diagnostic Monitor
- An interceptor logs response times of all network requests.
- The Admin Dashboard renders live SVG Sparklines updating every 3 seconds:
  1. **MongoDB Atlas Latency**: Displays database ping latency.
  2. **Express API Server Latency**: Tracks client-to-server request roundtrips.
- Includes a details slider displaying uptime logs and diagnostic statistics.

### 5. Secure Google OAuth Access Control
- Restricts admin access solely to your verified Google Identity.
- **Easter Egg Confirmation Overlay**: Signing in with a non-admin Google account triggers an animated modal with falling confetti and a humorous congratulations message ("You successfully logged in! ...but you aren't the admin. Here is a virtual cookie: 🍪").

### 6. BSON EJSON Backup & Restore System
- Custom sequential import/export backup scripts dump MongoDB Atlas collections as BSON EJSON text files into serial folders (`data_sequence` for local DB and `cluster_data_sequence` for Atlas cluster backups) to preserve ObjectIds and Date types cleanly.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Motion (Framer Motion), Lucide Icons, GSAP, Three.js
- **Backend**: Node.js, Express, MongoDB Node Driver, Google Auth Library, TSX, JSON Web Tokens (JWT)
- **Database**: MongoDB Atlas (Isolated namespace database: `portfolio-admin`)

---

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env` file inside the `backend/` folder following this structure:

```env
# Server Port
PORT=5001

# Google Gemini API Key (if using AI features)
GEMINI_API_KEY="your-gemini-key"

# Authorized Admin Email
ADMIN_EMAIL="sujoymoulick05@gmail.com"

# MongoDB Connection String (Atlas Cluster)
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio-admin?retryWrites=true&w=majority"

# JWT token signing secret
JWT_SECRET="your-super-secure-jwt-signing-key"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Configure `frontend/.env` (or set environment variables) for the client application:
```env
VITE_API_URL="http://localhost:5001"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

---

### 2. Local Setup & Execution

#### Backend Server
```bash
cd backend
npm install
npm run dev
```
Starts backend server at `http://localhost:5001`.

#### Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Starts development client at `http://localhost:3000`.

---

## 💾 Database Utilities

Backup and restoration commands are configured as npm scripts within the `backend/` directory:

### Run Database Backup
Exports all active collections to JSON sequence files:
```bash
cd backend
npm run db:backup
```

### Restore Database
Clears the target database and restores all sequential collections from sequence files:
```bash
cd backend
npm run db:restore
```

---

## 🧑‍💻 Author
**Sujoy Moulick**  
Portfolio website, freelancer admin console, and project logs.  
GitHub: [@Sujoymoulick](https://github.com/Sujoymoulick)
