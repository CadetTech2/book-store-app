# BookVault

A production-grade full-stack online book store built with React, Node.js, Express, and MySQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| Auth | JWT, bcrypt |
| DevOps | Docker, Docker Compose, Nginx |

## Features

- **User Authentication** — Register, login, JWT-based sessions, role-based access
- **Book Browsing** — Search, filter by category, pagination, featured books
- **Shopping Cart** — Add/remove items, update quantities, persistent cart
- **Order Management** — Checkout, order history, order tracking
- **Admin Dashboard** — Manage books, users, orders; view sales statistics
- **Image Upload** — Book cover image upload with validation
- **Responsive Design** — Mobile-first layout with Tailwind CSS

## Prerequisites

- Node.js 18+
- MySQL 8.0+ (or Docker)
- npm 9+

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bookvault.git
cd bookvault
```

### 2. Environment Setup

Copy the example environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with your MySQL credentials and JWT secret.

### 3. Database Setup

Create the database and run the schema:

```bash
mysql -u root -p < server/database/schema.sql
mysql -u root -p bookvault < server/database/seed.sql
```

### 4. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 5. Run Development Servers

```bash
# Backend (from server/)
npm run dev

# Frontend (from client/)
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### Docker Setup

```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`.

## Project Structure

```
book-app/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context providers
│   │   ├── hooks/       # Custom hooks
│   │   ├── layouts/     # Page layouts
│   │   ├── lib/         # Axios instance, helpers
│   │   ├── pages/       # Route-level components
│   │   ├── routes/      # Routing configuration
│   │   ├── services/    # API service layer
│   │   └── utils/       # Utility functions
│   └── ...
├── server/              # Express backend
│   ├── src/
│   │   ├── config/      # DB connection, env config
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/   # Auth, validation, errors
│   │   ├── models/      # Database query layer
│   │   ├── routes/      # API route definitions
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Response/error helpers
│   │   └── validators/  # Input validation schemas
│   ├── database/        # SQL schema and seed data
│   └── uploads/         # Book cover images
├── docker-compose.yml
├── Dockerfile.server
└── Dockerfile.client
```

## API Endpoints

| Resource | Method | Path | Access |
|----------|--------|------|--------|
| Auth | POST | `/api/auth/register` | Public |
| Auth | POST | `/api/auth/login` | Public |
| Auth | GET | `/api/auth/me` | Auth |
| Books | GET | `/api/books` | Public |
| Books | GET | `/api/books/:id` | Public |
| Books | POST | `/api/books` | Admin |
| Books | PUT | `/api/books/:id` | Admin |
| Books | DELETE | `/api/books/:id` | Admin |
| Categories | GET | `/api/categories` | Public |
| Cart | GET | `/api/cart` | Auth |
| Cart | POST | `/api/cart/items` | Auth |
| Orders | POST | `/api/orders` | Auth |
| Orders | GET | `/api/orders` | Auth |
| Users | GET | `/api/users` | Admin |
| Dashboard | GET | `/api/dashboard/stats` | Admin |

## Default Admin Account

After running the seed data:

```
Email: admin@bookvault.com
Password: Admin123!
```

## License

MIT
