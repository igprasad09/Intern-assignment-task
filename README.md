# 🛍️ Product Catalog Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-blue.svg?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791.svg?logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black.svg?logo=vercel)](https://vercel.com/)

A high-performance backend built with **Node.js**, **Express.js**, and **PostgreSQL (Neon)** for generating, storing, and browsing a massive product catalog. 

Designed as a take-home assignment for the CodeVector Internship, this API focuses on speed, scalable data seeding, and efficient cursor-based pagination.

---

## ✨ Features

- **🚀 High-Speed Data Generation:** Generates and inserts realistic product data using optimized batch insertions.
- **📜 Cursor-Based Pagination:** Fetches data blazingly fast regardless of table size, avoiding the performance bottlenecks of standard `OFFSET/LIMIT` queries.
- **🏷️ Dynamic Filtering:** Instantly filter products by category while maintaining correct pagination order.
- **⏱️ Staggered Timestamps:** Ensures perfectly unique insertion timestamps to prevent sorting collisions during pagination.
- **☁️ Cloud Deployed:** Live API hosted on Vercel with a Neon Serverless Postgres database.

---

## 📡 Live API Endpoints (Production)

**Base URL:** `https://intern-assignment-task.vercel.app`

### 1. Fetch Products (Cursor Pagination & Filtering)
Retrieves a paginated list of products (10 per page). Supports category filtering and cursor-based pagination for endless scrolling.

- **URL:** `/alldata`
- **Method:** `GET`
- **Query Parameters:**
  - `categoryfilter` *(optional)*: Filter by category (e.g., `Electronics`, `Fashion`, `Books`, `Furniture`, `Sports`).
  - `cursorDate` *(optional)*: The exact `updated_at` timestamp of the last item from the previous page.
  - `cursorId` *(optional)*: The `id` of the last item from the previous page (used as a tie-breaker).

**Example 1: Fetch first page of Books**
```http
GET [https://intern-assignment-task.vercel.app/alldata?categoryfilter=Books](https://intern-assignment-task.vercel.app/alldata?categoryfilter=Books)
