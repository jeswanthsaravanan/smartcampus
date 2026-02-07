# Smart College Student Portal

A production-ready, responsive web application with a chat-based interface for college students.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite |
| **Styling** | CSS with CSS Variables |
| **Backend** | Java Spring Boot 3.x |
| **Database** | MySQL 8 / H2 (dev) |
| **Auth** | JWT (JSON Web Tokens) |

## 📁 Project Structure

```
moooo/
├── frontend/                 # React Vite Frontend
│   ├── src/
│   │   ├── components/       # UI Components
│   │   │   ├── Login/        # Login page
│   │   │   ├── Dashboard/    # Dashboard page
│   │   │   └── Chat/         # Chat interface
│   │   ├── context/          # Auth context
│   │   ├── utils/            # Chatbot logic
│   │   └── index.css         # Global styles
│   └── package.json
│
├── backend/                  # Spring Boot Backend
│   ├── src/main/java/com/college/portal/
│   │   ├── controller/       # REST APIs
│   │   ├── model/            # JPA Entities
│   │   ├── repository/       # Data Access
│   │   ├── security/         # JWT Auth
│   │   ├── config/           # App Config
│   │   └── dto/              # Data Transfer Objects
│   └── pom.xml
│
└── database/                 # SQL Scripts
    └── schema.sql
```

## 🏃 Running the Application

### Prerequisites
- Node.js 18+ (for frontend)
- Java 17+ (for backend)
- MySQL 8 (optional - uses H2 by default)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at: **http://localhost:8080**

### Using MySQL (Production)

1. Create database:
```sql
CREATE DATABASE college_portal;
```

2. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_portal
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@college.edu | password123 |
| Admin | admin@college.edu | admin123 |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/timetable/today` | Today's schedule |
| GET | `/api/timetable/next` | Next class |
| GET | `/api/results` | Exam results |
| GET | `/api/attendance` | Attendance info |
| GET | `/api/notifications` | Announcements |

## 💬 Chat Commands

The chatbot understands natural language queries:

| Module | Example Queries |
|--------|-----------------|
| Timetable | "What's my next period?", "Today's schedule" |
| Result | "Show my marks", "Semester results" |
| Attendance | "My attendance", "Do I have shortage?" |
| Notification | "Latest announcements", "Show notifications" |

## 🎨 Features

- ✅ Modern dark theme UI with glassmorphism
- ✅ WhatsApp-style chat interface
- ✅ Responsive design (mobile-first)
- ✅ JWT authentication
- ✅ BCrypt password hashing
- ✅ Keyword-based chatbot
- ✅ Real-time typing indicators
- ✅ Demo mode (works without backend)

## 📝 License

MIT License - feel free to use for educational purposes.
