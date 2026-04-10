🏨 Anurag's Hostel Manager – Smart Hostel Management System

📌 Project Description

Hostel Manager is a smart hostel management system designed to streamline and automate hostel operations such as student management, room allocation, attendance tracking, and communication.

Built using a modern full-stack architecture, this system replaces traditional manual processes with an efficient, secure, and scalable digital solution.

🚀 The latest upgrade introduces a network-based attendance system that detects students using their device MAC / network presence, eliminating the need for cameras or face recognition.

🔗 Live Application

🌐 https://sggshostel.vercel.app

🧩 Features
👨‍🎓 Student Management
Add, update, and delete student records
Store detailed student information (name, room, contact, etc.)
Track student activity and status
🛏️ Room Allocation System
Assign rooms dynamically to students
Manage room capacity and availability
Automatic updates on room occupancy
📡 Smart Attendance System (Network-Based)
Attendance marked using WiFi / network detection
Identifies students via:
Device MAC address
Network IP scanning
Works across multiple routers in hostel environment
No camera / biometric required ✅
Efficient for large-scale hostels with multiple access points
🔐 Authentication & Security
Secure login system (Admin-controlled access)
Role-based navigation (Admin vs User)
Protected routes for sensitive operations
🧑‍💼 Admin Dashboard
Manage students, rooms, and attendance
View real-time data and updates
Update records without touching database manually
💬 Real-Time Chat System
Built-in communication between:
Students ↔ Admin
Useful for:
Complaints
Announcements
General communication
Improves hostel coordination and response time
📊 Data Management
Structured database for:
Students
Rooms
Attendance logs
Efficient querying and updates
📱 Fully Responsive UI
Works seamlessly on:
Mobile 📱
Tablet 💻
Desktop 🖥️
🛠️ Tech Stack
Tech	Purpose
⚛️ React + TypeScript	Frontend UI with type safety
⚡ FastAPI / Node.js	Backend APIs & business logic
🗃️ MongoDB / SQL	Database for storing hostel data
🔐 Firebase Auth	Authentication system
💅 Tailwind CSS	Responsive and modern UI
📡 Networking (Custom)	MAC/IP-based attendance detection
📦 Vercel / Render	Deployment
⚙️ Installation & Setup
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

# Backend
cd ../backend
uvicorn main:app --reload
# OR (if using Node)
nodemon index.js
📡 How Attendance System Works
System scans the hostel network
Detects connected devices across multiple routers
Matches device identity (MAC/IP) with registered student
Marks attendance automatically

✅ No manual entry
✅ No biometric
✅ Works in real-time

🚀 Future Enhancements
📍 GPS + Network hybrid attendance
📊 Analytics dashboard for attendance trends
🔔 Notification system (email/SMS)
📅 Leave management system
📦 Hostel inventory management
🤝 Contribution

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

📜 License

This project is licensed under the MIT License.

📞 Contact

If you'd like to collaborate or have any questions:

🌐 Portfolio: https://anurag-portfolio-psi.vercel.app
