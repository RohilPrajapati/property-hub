# 🏠 PropertyHub
 
A full-stack property listing platform built with **Django REST Framework** (backend) and **React + Vite** (frontend). Users can browse, filter, and view detailed property listings across Nepal.

## ✨ Features
 
- 🔐 JWT authentication with auto token refresh
- 🔍 Property search with trigram similarity (full-text)
- 🗂️ Filter by suburb, type, price range, bedrooms, bathrooms
- 🔗 Filters reflected in URL (shareable)
- 📄 Cursor-based pagination with load more
- 🏡 Detailed property view with agent contact
- 🛡️ Admin-only internal notes visibility

### Project Strucutre
```
propertyhub/
├── README.md                 ← root (rename from README.md)
├── backend/
│   └── README.md             ← rename from backend-README.md
└── frontend/
    └── README.md             ← rename from frontend-
```
## 📖 Documentation
 
- [Backend README](./backend/README.md) — Django setup, models, API endpoints, authentication
- [Frontend README](./frontend/README.md) — React setup, project structure, environment config

# Project Checklist

## 1. Design and implement

### a. Backend API
- [x] `/listings` — search + filters: price range, beds, baths, property type, keyword
- [x] `/listings/{id}` — property detail

### b. Frontend
- [x] Property search page with filters
- [x] Results list (no map)
- [x] Property detail page

---

## 2. Relational DB (Postgres-style)
- [x] Table for properties
- [x] Table for agents
- [x] Indexes that support common search patterns (price, suburb, type, etc.)

---

## 3. Implement
- [x] Basic role flag (`is_admin: boolean`) on the server
- [x] Admins can see extra metadata (e.g., internal status notes) that normal users cannot

---

## 4. Add
- [x] Pagination (offset- or cursor-based)
- [x] URL-friendly search (e.g., `/listings?suburb=Northside&price_min=500000`)

---

## 5. Deliver a clean, testable codebase
- [x] At least 2–3 unit or integration tests (e.g., API endpoint tests or DB query tests)
- [x] README: how to run the app
- [x] README: how to seed the DB
- [x] README: example API calls

### TODOs
- data seeder for agent done
- add agent to property (contact) done
- detail view for property done
- authentication done
- pagination done
- throttling api X
- unpublish data in frontend for admin user only
- frontend
    - create view
    - use axios
    - client header for auth request
    - store the token
optional
- dockerize
- nginx setup 