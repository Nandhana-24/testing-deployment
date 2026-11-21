# WatchHub

WatchHub is a responsive watch storefront with a React/Vite frontend and a Spring Boot REST API backed by MySQL.

## Requirements

- Node.js 20+
- Java 17+ and Maven 3.9+
- MySQL 8+

## Configure and run the backend

Create a MySQL database, then set the following environment variables before starting Spring Boot:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/watchhub?createDatabaseIfNotExist=true"
$env:DB_USERNAME="your_mysql_user"
$env:DB_PASSWORD="your_mysql_password"
```

Optional: configure an initial administrator account. Both values must be provided; the password is encoded with BCrypt.

```powershell
$env:WATCHHUB_ADMIN_EMAIL="admin@example.com"
$env:WATCHHUB_ADMIN_PASSWORD="choose-a-strong-password"
```

From `watchhub/backend` run `mvn spring-boot:run`. The API listens on `http://localhost:8080`. Hibernate creates/updates tables and sample watches are inserted on first startup.

## Configure and run the frontend

From `watchhub/frontend` run:

```powershell
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). Set `VITE_API_URL` if the backend is hosted elsewhere; it defaults to `http://localhost:8080/api`.

## Features

- Product search, category and price filters, product details and stock display
- Registration and login with BCrypt-backed accounts and HTTP Basic authentication
- Server-side cart and checkout; successful orders reserve stock and keep an order summary
- Admin product and stock management, plus order listing
- Responsive premium navy-and-gold storefront

Public product routes: `GET /api/products`, `GET /api/products/{id}`. Registration/login routes: `POST /api/auth/register`, `POST /api/auth/login`. Cart and order routes require authentication; product writes and all-order listing require the `ADMIN` role. Cart/order user IDs are the authenticated email address and must match the signed-in user.

Shipping is $12 for orders below $250 and complimentary at $250 or above.

## API overview

- `GET /api/products?search=&category=&minPrice=&maxPrice=`
- `POST`, `PUT`, `DELETE /api/products[/{id}]` (admin)
- `GET /api/auth/me`, `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/cart/{userId}`, `POST /api/cart/add`, `PUT /api/cart/update`, `DELETE /api/cart/remove/{id}`
- `POST /api/orders`, `GET /api/orders/{userId}`, `GET /api/orders` (admin)

The frontend stores Basic credentials for the current browser tab only. For production deployment, use HTTPS and a hardened token/session strategy, externalize all secrets, and configure database migrations and backups.
