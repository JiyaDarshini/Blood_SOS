# BloodSOS – Emergency Blood Donor Network

> **"Connecting communities when every minute matters."**

---

## 📋 Project Overview

**BloodSOS** is a neighbourhood-level emergency blood donor platform that connects people who urgently need blood with available, compatible blood donors in their locality. Built as a full-stack college project using React, Node.js, Express, and Neon PostgreSQL with Prisma ORM.

---

## 🎯 Abstract

Blood shortage is a critical issue during medical emergencies. Traditional methods of finding blood donors involve time-consuming phone calls, hospital visits, and social media posts that may not reach the right people quickly enough. BloodSOS provides a centralized, real-time platform that connects blood requesters with compatible, available donors in their area — reducing the time required to find the right blood donor from hours to minutes.

---

## ❗ Problem Statement

- Emergency blood requirements often arise without warning
- Finding compatible donors manually is slow and unreliable
- No centralized local donor directory exists in most localities
- Existing national databases are often outdated or not accessible in real-time
- People lack a quick way to broadcast emergency SOS requests to nearby donors

---

## 💡 Proposed System

BloodSOS provides:
- Real-time donor registration with blood group and location
- Emergency SOS broadcast system
- Smart blood compatibility matching engine
- One-click Call and WhatsApp contact
- Availability toggle for donors
- Admin monitoring dashboard
- Secure authentication with JWT and bcrypt

---

## 🎯 Objectives

1. Enable quick donor registration with blood group and locality
2. Allow users to post emergency SOS blood requests
3. Automatically match SOS requests with compatible, available donors
4. Provide one-click contact via phone or WhatsApp
5. Record contact logs for accountability
6. Enable donors to manage their availability status
7. Provide administrators with a platform monitoring dashboard

---

## 🔧 Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| CSS (Vanilla) | Styling |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin requests |
| express-validator | Input validation |

### Database
| Technology | Purpose |
|-----------|---------|
| Neon PostgreSQL | Serverless database |
| Prisma ORM | Database client and migrations |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Pages   │  │Components│  │ Services │  │Context │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST (Axios)
┌─────────────────────▼───────────────────────────────────┐
│               SERVER (Node.js + Express)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Routes  │  │Controllers│  │Middleware│  │Services│  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼───────────────────────────────────┐
│              Neon PostgreSQL (Serverless)                │
│  ┌──────┐  ┌────────┐  ┌──────────────┐  ┌──────────┐  │
│  │users │  │ donors │  │ sos_requests │  │contact_logs│ │
│  └──────┘  └────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Architecture

### Tables
- **users** – Registered users (donors, requesters, both, admin)
- **donors** – Donor profiles with blood group, locality, availability
- **sos_requests** – Emergency blood requests
- **contact_logs** – Records of contact attempts
- **localities** – Locality/area reference data

### ER Diagram Description
- `users` 1→1 `donors` (a user can have one donor profile)
- `users` 1→N `sos_requests` (a user can post multiple SOS)
- `sos_requests` 1→N `contact_logs` (each SOS can have multiple contacts)
- `donors` 1→N `contact_logs` (each donor can be contacted multiple times)

---

## 🔗 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/change-password` | Change password |

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donors` | List donors with filters |
| GET | `/api/donors/:id` | Get donor by ID |
| PUT | `/api/donors/availability` | Toggle availability |
| GET | `/api/donors/match/:bloodGroup` | Get compatible donors |

### SOS Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sos` | Create SOS request |
| GET | `/api/sos` | Get SOS requests |
| GET | `/api/sos/:id` | Get single SOS |
| PUT | `/api/sos/:id` | Update SOS |
| PUT | `/api/sos/:id/fulfill` | Mark as fulfilled |
| PUT | `/api/sos/:id/close` | Close SOS |
| DELETE | `/api/sos/:id` | Delete SOS |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Log contact attempt |
| GET | `/api/contacts` | Get contact history |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Admin statistics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/donors` | All donors |
| GET | `/api/admin/sos` | All SOS requests |
| GET | `/api/admin/contacts` | All contact logs |

---

## 🚀 Installation Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- A Neon PostgreSQL account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/BloodSOS.git
cd BloodSOS
```

### 2. Neon PostgreSQL Setup
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Backend Setup
```bash
cd server
npm install
```

### 5. Prisma Migration
```bash
cd ../prisma  # or from server directory
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Frontend Setup
```bash
cd ../client
npm install
```

### 7. Running the Application

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` in the root and/or `server/` directory:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=your_very_secure_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## 🩸 Blood Compatibility Engine

| Donor Blood Group | Can Donate To |
|------------------|---------------|
| O- | O-, O+, A-, A+, B-, B+, AB-, AB+ (Universal Donor) |
| O+ | O+, A+, B+, AB+ |
| A- | A-, A+, AB-, AB+ |
| A+ | A+, AB+ |
| B- | B-, B+, AB-, AB+ |
| B+ | B+, AB+ |
| AB- | AB-, AB+ |
| AB+ | AB+ (Universal Recipient) |

---

## 🔒 Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens for stateless authentication
- Protected routes via middleware
- Role-based access control (DONOR, REQUESTER, BOTH, ADMIN)
- SQL injection protection via Prisma ORM parameterized queries
- CORS configured for specific origins
- Environment variables never exposed to frontend
- Donor phone numbers not publicly displayed

---

## 🚀 Future Enhancements

1. Push notifications when SOS is posted near a donor
2. SMS/email alerts for matching donors
3. Geolocation-based proximity matching
4. Verified donor badges (hospital or blood bank verified)
5. Blood camp announcements
6. Mobile app (React Native)
7. Real-time SOS updates via WebSockets
8. Integration with official blood bank databases

---

## ⚠️ Limitations

- Does not medically verify donor eligibility
- Does not replace hospital blood banks
- Phone number privacy relies on platform trust
- No SMS/email notification system in current version

---

## ⚕️ Medical Disclaimer

> **BloodSOS helps connect potential donors and people requesting blood. Donor eligibility, blood compatibility, screening, cross-matching, transfusion decisions and medical procedures must always be handled by qualified healthcare professionals and authorized blood banks.**
>
> BloodSOS does not medically verify donors and does not replace hospitals or blood banks.

---

## 👨‍💻 Authors

**BloodSOS Development Team**
Full Stack Web Technologies – College Project

---

*Built with ❤️ for the community. Connecting lives when every minute matters.*
