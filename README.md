# SmartQueue - QR-Based Virtual Queue Management System

A full-stack application that replaces physical queues with a live virtual queue. Users scan a QR code, join
a queue, receive a token, and track their live position. Admins manage queues, call the next token, and view
analytics. Everything follows strict First-Come-First-Served (FCFS) order.

## Tech Stack

**Backend:** Java 21, Spring Boot 3.3, Spring Data JPA / Hibernate, MySQL, Spring Validation, Spring Mail,
Springdoc OpenAPI (Swagger), Spring Scheduler, Maven, Lombok

**Frontend:** React 19, Vite, Axios, React Router, Tailwind CSS, React Icons

## Project Structure

```
smartqueue/
├── backend/                 Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/smartqueue/
│       │   ├── config/          CORS + Swagger configuration
│       │   ├── controller/      REST controllers (User, Queue, Token, Admin)
│       │   ├── dto/request/     Incoming request DTOs
│       │   ├── dto/response/    Outgoing response DTOs
│       │   ├── entity/          JPA entities (User, Queue, Token)
│       │   ├── enums/           QueueType, TokenStatus
│       │   ├── exception/       Custom exceptions + GlobalExceptionHandler
│       │   ├── mapper/          Entity <-> DTO mappers
│       │   ├── notification/    Email notification service
│       │   ├── repository/      Spring Data JPA repositories
│       │   ├── scheduler/       Token expiry / auto-advance scheduler
│       │   ├── service/         Service interfaces
│       │   ├── service/impl/    Service implementations (business logic)
│       │   ├── util/            Token number generator
│       │   └── SmartQueueApplication.java
│       └── resources/
│           ├── application.properties
│           └── schema.sql
│
└── frontend/                 React + Vite SPA
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── components/        Navbar, Footer, Sidebar, QueueCard, TokenCard, etc.
        ├── context/            Theme, Toast, Session (React Context)
        ├── hooks/              usePolling (5s live refresh)
        ├── layouts/            MainLayout
        ├── pages/              Home, Register, QueueList, QueueDetails, JoinQueue,
        │                       MyToken, TrackQueue, AdminDashboard, Statistics
        ├── routes/             AppRoutes.jsx
        └── services/           Axios API layer (user/queue/token/admin services)
```

## Prerequisites

- Java 21 (JDK)
- Maven 3.9+
- Node.js 18+ and npm
- MySQL 8+ running locally

## Backend Setup

1. Create the database (or let JPA/Hibernate auto-create it - `schema.sql` is provided for reference/manual setup):

   ```bash
   mysql -u root -p < backend/src/main/resources/schema.sql
   ```

2. Edit `backend/src/main/resources/application.properties` and set your MySQL username/password:

   ```properties
   spring.datasource.username=root
   spring.datasource.password=your-password
   ```

3. (Optional) To enable real email notifications, set your SMTP credentials and flip the flag:

   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   smartqueue.mail.enabled=true
   ```

   With `smartqueue.mail.enabled=false` (the default), notifications are simply logged to the console -
   handy for local development without SMTP credentials.

4. Run the backend:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

   The API starts on **http://localhost:8080**.
   Swagger UI: **http://localhost:8080/swagger-ui.html**

## Frontend Setup

1. Install dependencies and start the dev server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The app starts on **http://localhost:5173** and talks to the backend at the URL configured in
   `frontend/.env` (`VITE_API_BASE_URL`, defaults to `http://localhost:8080`).

## Core Business Rules

- A user may have only **one active token per queue** at a time (WAITING / CALLED / CONFIRMED).
- A user may join **multiple different queues** simultaneously.
- Tokens are served strictly **FCFS**, formatted as `<PREFIX>-<3-digit sequence>` (e.g. `TMP-001` for a
  TEMPLE queue, `BNK-014` for a BANK queue).
- If a **CALLED** token is not confirmed within **2 minutes**, a background scheduler (runs every minute)
  automatically marks it **EXPIRED** and calls the next **WAITING** token.
- Queue types: `TEMPLE`, `BANK`, `HOSPITAL`, `RESTAURANT`, `GOVERNMENT_OFFICE`.
- Token statuses: `WAITING`, `CALLED`, `CONFIRMED`, `COMPLETED`, `EXPIRED`, `SKIPPED`.

## Key REST Endpoints

| Module | Method | Endpoint | Description |
|---|---|---|---|
| Users | POST | `/users` | Register a user |
| Users | GET | `/users` | List / search users |
| Queues | POST | `/queues` | Create a queue |
| Queues | POST | `/queues/{id}/pause` | Pause a queue |
| Queues | POST | `/queues/{id}/resume` | Resume a queue |
| Tokens | POST | `/queues/{queueId}/join` | Join a queue, get a token |
| Tokens | GET | `/tokens/{id}/position` | Track live position |
| Tokens | POST | `/tokens/{id}/confirm` | Confirm presence when called |
| Admin | POST | `/admin/next/{queueId}` | Call the next waiting token |
| Admin | GET | `/admin/dashboard/{queueId}` | Live dashboard for a queue |
| Admin | GET | `/admin/statistics` | Analytics across all queues |

Full interactive documentation is available via Swagger UI once the backend is running.

## Real-Time Updates

The frontend polls the backend every 5 seconds (`usePolling` hook) for live position, dashboard, and
statistics data - no page refresh required. The architecture is structured so this can be swapped for
WebSockets/STOMP in the future without touching the UI components.

## Notes for Production

- `spring.jpa.hibernate.ddl-auto=update` is convenient for development; use migrations (Flyway/Liquibase)
  for production schema management instead.
- The frontend uses `localStorage` only to remember the current user/token ID between visits (no
  sensitive data) - there is no authentication layer in this version, which would be a natural next step
  (e.g. Spring Security + JWT) for a production deployment.
