# 🚗 RentGrid – Vehicle Rental Management System

RentGrid is a full-stack vehicle rental management application designed to simplify the vehicle booking and rental management process. It provides separate experiences for customers and administrators, allowing customers to explore vehicles, make bookings, manage rentals, and get AI-powered assistance, while administrators manage vehicles, bookings, customers, returns, and reports.

🌐 **Live Demo:** https://rentgrid-app-virid.vercel.app

---

## ✨ Features

### 👤 Customer Features
- User registration and secure login.
- JWT-based authentication.
- Browse available vehicles and view vehicle details.
- Book vehicles by selecting rental dates.
- View and manage personal bookings.
- Cancel bookings.
- Request rental date modifications.
- View rental invoices and additional charges.
- Manage personal profile.
- Submit support requests and track their status.

### 🛠️ Admin Features
- Admin dashboard.
- Manage vehicles (Add, Update, Delete, View).
- Manage customers and bookings.
- Approve or reject booking date modification requests.
- Manage vehicle returns.
- Calculate extra kilometre and late-return charges.
- Add damage charges to rental invoices.
- View revenue and booking reports.
- View rental history.
- Manage customer support requests and update their status.

### 🤖 AI-Powered Features
- **AI Vehicle Finder:** Helps customers find suitable vehicles based on their requirements.
- **AI Damage Assessment:** Uses AI to analyze text-based vehicle damage descriptions and assist with damage assessment.

### 🔐 Security
- Spring Security integration.
- JWT-based authentication.
- Role-based access control (Admin and Customer).
- BCrypt password encryption.
- Protected REST API endpoints.

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Java 25, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL, Spring Data JPA, Hibernate |
| API Communication | REST APIs, Axios |
| AI Integration | Groq API |
| Build Tool | Maven, npm |
| API Testing | Postman |
| Version Control | Git, GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | Clever Cloud |

---

## 🏗️ Application Architecture

```text
             Customer / Admin
                    |
                    v
             React Frontend
              (Vercel)
                    |
                    | REST API
                    v
            Spring Boot Backend
                (Render)
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Spring    JWT Auth   Groq AI
       Data JPA  Security   Integration
          |
          v
       MySQL Database
       (Clever Cloud)
```

---

## 📸 Application Modules

### Customer Dashboard
- Vehicle browsing and booking.
- Booking history and rental invoices.
- AI Vehicle Finder.
- Support request management.

### Admin Dashboard
- Vehicle and customer management.
- Booking and return management.
- Revenue reports.
- Damage charge management.
- Support request management.

---

## ⚙️ Installation and Setup

### Prerequisites
- Java 25
- Node.js and npm
- MySQL
- Maven
- Git

### 1. Clone the repositories

**Frontend**
```bash
git clone https://github.com/GauriShinde09/rentgrid-frontend.git
cd rentgrid-frontend
npm install
```

**Backend**
```bash
git clone https://github.com/GauriShinde09/rentgrid-backend.git
```

### 2. Backend Configuration

Create or configure your `application.properties` file with the required database and application settings.

Configure these environment variables:

```env
DB_URL=jdbc:mysql://localhost:3306/rentgrid_db
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_app_password
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Backend

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 4. Frontend Configuration

Create a `.env` file in the frontend root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 5. Run the Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🔑 User Roles

| Role | Access |
|---|---|
| ADMIN | Vehicle, customer, booking, return, reports and support management |
| CUSTOMER | Vehicle browsing, bookings, profile, invoices and support requests |

---

## 🚀 Deployment

RentGrid is deployed using the following services:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Clever Cloud MySQL

🌐 Live Application: https://rentgrid-app-virid.vercel.app

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Developing RESTful APIs using Spring Boot.
- Implementing JWT authentication and role-based authorization.
- Connecting React frontend with Spring Boot backend.
- Database design and management using MySQL and Hibernate.
- Integrating third-party AI APIs using Groq.
- Handling real-world booking and rental workflows.
- Deploying a full-stack application using cloud hosting platforms.
- Testing APIs and debugging production deployment issues.

---

## 👩‍💻 Developer

**Gauri Shinde**

BE Graduate | Java Full Stack Developer

- GitHub: https://github.com/GauriShinde09

---

⭐ If you find this project interesting, feel free to explore the repositories and check out the live application!
