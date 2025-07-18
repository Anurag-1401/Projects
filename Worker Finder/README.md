# 🛠️ Worker Finder – Skilled Services Made Simple

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success)
![Issues](https://img.shields.io/github/issues/Anurag-1401/Projects)
![Stars](https://img.shields.io/github/stars/Anurag-1401/Projects?style=social)

---

## 📌 Project Description

**Worker Finder** is a full-stack web application that connects users with skilled and verified workers for household and professional services like plumbing, carpentry, electrical work, and more.

It simplifies service discovery by integrating search, real-time chat, admin updates, and secure payment handling — all within a responsive and user-friendly interface.

---

## 📸 Preview

🔗 [Live Demo](https://workerfinder.vercel.app/)

---


## 🚀 Features

- 🔍 **Search & Filter**: Find workers based on category, rating, or location.
- 🧑‍🔧 **Worker Profiles**: View detailed worker information including skillset, experience, and availability.
- 💬 **Real-Time Chat**: Communicate directly with workers before hiring.
- 💳 **Payment Integration**: Secure online payments via Razorpay.
- 📢 **Admin Update Panel**: Announcements or job updates visible to users.
- 📱 **Mobile-Responsive UI**: Works seamlessly on phones, tablets, and desktops.

---

## 🛠️ Tech Stack

| Tech             | Used For                      |
|------------------|-------------------------------|
| ⚛️ ReactJS        | Frontend (User Interface)      |
| 🌐 Node.js & Express | Backend & API development     |
| 🗃️ MongoDB        | Database for user/worker data |
| 🔐 JWT / Session  | (if used) User authentication  |
| 💸 Razorpay       | Payment gateway integration    |
| 🔧 Context API / Redux | State management (optional)  |
| ✨ CSS | Styling and responsive layout  |

---

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Anurag-1401/Projects.git
cd Projects/worker-finder

# Install dependencies for frontend and backend
cd frontend
npm install

cd ../backend
npm install

# Start frontend and backend
cd frontend
npm start

cd ../backend
nodemon index.js
