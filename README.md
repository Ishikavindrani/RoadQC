# 🛣️ Road QC - Smart Infrastructure Monitoring & Audit

Road QC is a high-integrity field inspection and fraud-detection platform designed for road construction quality assurance. It uses geographic sampling, geo-fencing, and real-time trace analysis to prevent "ghost inspections" and ensure thorough audits of physical infrastructure assets.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, Recharts, Lucide Icons, Nginx Proxy.
- **Backend**: Node.js, Express, JWT Authentication, Mongoose.
- **Database**: MongoDB (Persistent via Docker volumes).
- **Deployment**: Single-command initialization with Docker Compose.

## 🚀 Local Deployment (Any PC)

Ensuring the platform runs on any machine is simplified through Docker. Follow these exact steps:

### 1. Prerequisites
- **Docker Desktop** installed (Windows/Mac/Linux).
- Ensure ports **3000**, **5000**, and **27017** are free.

### 2. Implementation Steps
1.  **Clone/Copy the Project Directory**:
    Move the `RoadQC` folder to your desired location.
2.  **Initialize the Full Stack**:
    Open a terminal in the `RoadQC` directory and run:
    ```bash
    docker-compose up -d --build
    ```
    *This will pull images, build the custom Node and React containers, and link the MongoDB volume.*
3.  **Seed the Database (Crucial for first run)**:
    Once the containers are up, run this command to create the default Admin and Officer accounts:
    ```bash
    docker exec -it roadqc-api node seed.js
    ```
4.  **Access the Software**:
    - **Admin Analytics Dashboard**: Open `http://localhost:3000` in your browser.
    - **Inspector Field App**: Access the same URL on a mobile device or browser (login as Officer).

### 3. Accessing the Backend Directly
- Health Check: `http://localhost:5000/api/health`
- Database access: Connect to `localhost:27017` using MongoDB Compass.

## 🔐 Default Credentials (Profiles)

The seed script creates the following default access levels:
- **Admin**: `admin@roadqc.gov.in` / `password123`
- **Operator (Anjali)**: `anjali@roadqc.gov.in` / `password123`
- **Operator (Vikram)**: `vikram@roadqc.gov.in` / `password123`

## 📦 Startup Data
Once seeded, the database will contain **3 Pre-registered Road Segments**:
1. Delhi-Mumbai Expressway (Gurugram) - *In Progress*
2. Yamuna Bypass Link (Mathura) - *Planned*
3. Western Coastal Road (Raigad) - *Completed*


## 🔍 Core Features

- **Inspector Check-In**: Geofenced sampling ensuring the inspector is physically on-site.
- **Fraud Detection**: Automatic flagging for low coverage, bunched checkpoints, and impossible speed violations.
- **Admin Dashboard**: Real-time analytics, suspicious activity highlighting, and road segment management.
- **Immutable Audit Trail**: Read-only history of every checkpoint, timestamp, and metadata-rich photo.

## 📂 Project Structure (Full Stack)

- `/backend`: Node.js API with Mongoose models, auth middleware, and fraud-detection controllers.
- `/frontend`: React SPA using Vite, premium glassmorphism styles, and Axios interceptors.
- `docker-compose.yml`: Orchestration for the entire environment.
