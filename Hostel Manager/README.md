# 🏨 Anurag's Hostel Manager – Smart Hostel Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success)
![Built With](https://img.shields.io/badge/stack-MERN%20%2B%20FastAPI-ff69b4)
![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen)

---

## 📌 Project Description

This is my **Hostel Manager Application** built using a **modern full-stack architecture** with **MERN + TypeScript + FastAPI**. It is designed to digitize and simplify hostel operations such as student management, room allocation, attendance tracking, and communication.

The system replaces manual processes with an efficient, scalable, and secure solution. It also includes a **Smart Network-Based Attendance System** that works using **device MAC / network detection**, removing the need for cameras or biometric systems.

---

## 🔗 Live Application

🌐 https://sggshostel.vercel.app

---

## 🧩 Features

- 🧑‍🎓 **Student Management** – Add, update, and manage student records with complete details.
- 🛏️ **Room Allocation System** – Assign rooms dynamically and manage occupancy efficiently.
- 📡 **Smart Attendance (Network-Based)** –  
  - Detects students via **MAC / IP address**  
  - Works across multiple routers in hostel  
  - No camera / biometric required  
  - Fully automated attendance marking  
- 🔐 **Authentication System** – Secure login with role-based access (Admin/User).
- 🧑‍💼 **Admin Dashboard** – Manage students, rooms, and attendance from a centralized panel.
- 💬 **Real-Time Chat System** – Communication between students and admin for queries and updates.
- 📊 **Database Management** – Structured storage for students, rooms, and attendance logs.
- 📱 **Fully Responsive UI** – Optimized for mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack

| Tech                      | Purpose                                  |
|---------------------------|------------------------------------------|
| ⚛️ React + TypeScript      | Frontend UI with strict typing           |
| ⚡ FastAPI / Node.js       | Backend & API handling                   |
| 🗃️ MongoDB / SQL          | Database management                      |
| 🔐 Firebase Auth           | Authentication (Login system)            |
| 💅 Tailwind CSS            | Responsive and modern UI design          |
| 📡 Networking Logic        | MAC/IP-based attendance detection        |
| 📦 Vercel / Render         | Deployment                              |

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/hostel-manager.git
cd hostel-manager

# 2. Setup Frontend
cd frontend
npm install

# 3. Setup Backend
cd ../backend
npm install

# 4. Run the app (in separate terminals)

# Frontend
cd frontend
npm run dev

# Backend (FastAPI)
cd ../backend
uvicorn main:app --reload

# OR (Node backend)
nodemon index.js
