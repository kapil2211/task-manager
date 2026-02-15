# 📝 Task Manager App

A modern Task Manager built using **React 18, TypeScript, Redux Toolkit, and Mock Service Worker (MSW)**.

This project demonstrates authentication flow, async CRUD operations, proper state management, API mocking, skeleton loading animations, and clean UI architecture.

---

## 🚀 Live Features

- 🔐 Mock Authentication (JWT-based)
- 📋 Full Task CRUD (Create, Read, Update, Delete)
- 🔄 Async API simulation using MSW
- 💾 Persistent task data across reloads
- 🧠 Redux Toolkit for state management
- 🎨 Modern glass-style UI using Tailwind CSS
- ⏳ Skeleton loading animation
- 📱 Responsive design
- 🔒 Protected Dashboard route

---

## 🛠 Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- Mock Service Worker (MSW)
- Tailwind CSS
- Vite


---

## 🧪 Mocking Layer (How It Works)

This project uses **Mock Service Worker (MSW)** to simulate backend APIs.

Instead of calling a real server:

- MSW intercepts network requests
- Returns mocked responses
- Simulates real async behavior (including delay)

### Mocked Endpoints

- `POST /api/login` → Returns fake JWT
- `GET /api/tasks` → Returns all tasks
- `POST /api/tasks` → Create new task
- `PUT /api/tasks/:id` → Update task
- `DELETE /api/tasks/:id` → Delete task

Tasks persist using `localStorage` inside the mock layer.

This creates a realistic frontend-backend architecture without needing a real backend.

---

## 🏗 Architecture Flow

UI (React Components)
↓
Redux Async Thunks
↓
API Layer (fetch calls)
↓
MSW Mock Backend
↓
Redux Store Update
↓
UI Re-render


This mimics real-world production architecture.

---

## 💻 How To Run Locally

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd task-manager
npm install
npm run dev

** 🔐 Test Credentials **

Email: test@test.com
Password: 123456

🎨 UI Features

Glassmorphism design

Capsule toggle buttons

Priority badges

Status indicators (Pending / Completed)

Edit modal popup

Skeleton loader animation

Responsive layout (Mobile friendly)

⚡ What This Project Demonstrates

Proper async state management using Redux Toolkit

Separation of concerns (API layer, state, UI)

Mock backend architecture

Handling loading and error states

Protected routing with authentication

Clean scalable folder structure

🚀 Future Improvements

Drag & drop task reordering

Toast notification system

Dark mode toggle

Unit testing (React Testing Library)

Integration with real backend

Deployment (Vercel / Netlify)
