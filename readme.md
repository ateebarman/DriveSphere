# DriveSphere - Enterprise Car Rental Platform

**DriveSphere** is a high-performance, concurrency-safe car rental platform built with the MERN stack. It features a robust booking engine capable of handling high-traffic scenarios, preventing double bookings through distributed locking, and managing real-time inventory with dynamic availability checks.

## 🚀 Key Features

*   **Advanced Booking Engine**: 
    *   **Concurrency Safe**: Uses **Redis Distributed Locks** to prevent race conditions during high-demand periods.
    *   **Atomic Transactions**: MongoDB Sessions ensure data integrity during booking creation.
    *   **Dynamic Availability**: Inventory is calculated in real-time based on date ranges, allowing for precise back-to-back scheduling.
    *   **Idempotency**: Prevents duplicate bookings from network retries or double-clicks.
*   **Reservation System**: 
    *   "Hold" mechanism reserves vehicles for 10 minutes pending payment.
    *   Automated background cleanup (Cron Jobs) releases expired reservations.
*   **Payment Integration**:
    *   Seamless integration with **Stripe Checkout**.
    *   Secure webhook handling for payment confirmation.
*   **Role-Based Access Control**:
    *   **Client**: Browse, filter, book, and manage history.
    *   **Car Owner**: List assets, view earnings, manage fleet status.
    *   **Admin**: System-wide oversight and user management.
*   **Performance & Optimization**:
    *   **Intelligent Caching**: Implements a read-through caching strategy using **Redis** for high-traffic endpoints (Inventory, User Bookings, Revenue Reports).
    *   **Proactive Invalidation**: Event-driven cache purging ensures data consistency across user and owner dashboards immediately after any state change.
    *   **L3 Skeleton Screens**: Premium shimmer effects and skeleton states integrated via Framer Motion for a perceived zero-latency UX.

## 🛠 Tech Stack

*   **Frontend**: React (Vite), Redux Toolkit, Framer Motion, TailwindCSS.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose) for persistence, Redis (Upstash) for locking & caching.
*   **Infrastructure**: Stripe (Payments), Node-Cron (Background Tasks).

## ⚡ Architecture Deep Dive: High-Concurrency Booking
The booking system follows a **"Check-Lock-Reserve-Pay"** architectural pattern specifically designed to handle "Flash Sale" style spikes:

1.  **Request Initiation**: Client sends a booking request with date range.
2.  **Idempotency Gate**: Redis checks a unique key (`idempotency:booking:...`) generated from the user's intent to reject duplicate requests immediately (`409 Conflict`).
3.  **Distributed Lock**: Redis acquires a mutex on the specific `carId`. This prevents two separate server instances from processing the same car simultaneously. If locked, returns `423 Locked`.
4.  **ACID Transaction (MongoDB)**:
    *   **Availability Check**: System queries for overlapping `confirmed` or active `pending` bookings within the requested time window.
    *   **Reservation**: If available, creates a `pending` booking valid for 10 minutes.
5.  **Payment Handoff**: User is redirected to Stripe Checkout.
6.  **Background Cleanup**: A cron job (Node-Cron) runs every minute to identify `pending` bookings older than 10 minutes and marks them as `expired`, immediately freeing up the vehicle for other users.

## 🚀 Performance Architecture: Redis Caching Layer
To achieve enterprise-grade speed, we implemented a multi-layered caching strategy:

### 1. Read-Through Caching
*   **Inventory Search**: Car listings are cached for 30 seconds with keys hashed by the user's search parameters (location, brand, specific dates).
*   **User/Owner Dashboards**: High-cost aggregation queries (like Revenue Reports and Booking History) are cached for 5-10 minutes, reducing MongoDB compute usage by up to 80%.

### 2. Event-Driven Invalidation
We use a "Passive Cache with Active Purge" model. Whenever a critical action occurs (New Booking, Cancellation, Car Update), the system surgically identifies and deletes the relevant Redis keys:
*   `cars_query_*`: Cleared on any inventory change.
*   `owner_bookings_${id}`: Cleared on new bookings.
*   `user_bookings_${id}`: Cleared on cancellations.

## 💎 UX Excellence: Skeleton Loading System
Rather than using generic "Loading" spinners, we implemented **L3 Skeleton Screens**:
*   Custom-built shimmer components using Framer Motion.
*   Structural placeholders that match the exact layout of the data cards, reducing layout shifts (CLS) and improving perceived performance.

## 🔧 Installation & Setup

### Prerequisites
*   Node.js v14+
*   MongoDB Instance
*   Redis Instance (Local or Upstash)
*   Stripe Account

### Environment Variables (.env)

Create a `.env` file in the `server` directory:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URL=your_mongodb_connection_string

# Authentication
JWT_SECRET_KEY=your_jwt_secret

# Redis (Upstash or Local)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Client URL
FRONTEND_URL=http://localhost:5173
```

### Running Locally

1.  **Backend**:
    ```bash
    cd server
    npm install
    npm run dev
    ```

2.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 🧪 Testing Concurrency

We have included a specialized test script to verify the robustness of the booking engine.

**Scenario**: Two users attempt to book the *same car* for the *same dates* at the *exact same millisecond*.

**Run the Test**:
```bash
cd server
node test_concurrency.js
```

**Expected Output**:
```text
✅ User 1: SUCCESS (201) - Booking ID: ...
🔒 User 2: LOCKED (423) - Vehicle is currently being processed...
```

---
*Built for the DriveSphere Capstone Project.*
