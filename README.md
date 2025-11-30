# `<div style="display:flex;aligh-items:baseline;gap:1rem;">`![alt text](frontend/public//logo64.png) LogiSick – Smart inventory and logistics management, all in one place.`</div>`

> LogiSick is a web-based inventory and logistics management platform designed to streamline supply chain operations. It enables businesses to efficiently track & manage warehouse inventories, process orders, and monitor deliveries in real time. The system provides an intuitive dashboard, smart notifications for low stock, and detailed reporting to improve decision-making and reduce operational delays. By integrating inventory control with logistics workflows, LogiSick ensures higher accuracy, cost efficiency, and smoother end-to-end management.

---

# Features

* #### Product Management

  * Add, update, and delete products
  * Categorization & tags (e.g., electronics, perishables)
  * QR code support
  * Search & Filter
  * Quick product lookup (by name, SKU, barcode, category)
  * Advanced filtering (by supplier, quantity, expiry date)
* #### Analytics & Reporting

  * Dashboards
  * Total stock value
  * Reports
* #### Order & Sales Features

  * Purchase Orders
  * Create and track purchase orders
  * Sales Orders
* #### User & Role Management

  * Access Control
  * Admin, Manager, Staff roles
  * Permissions for editing vs. view-only
  * Activity logs

---

# Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication, Role-based access control
- **Other Tools:**  REST APIs, Git/GitHub

---

## Documentation

For full API reference and usage examples, see the [API Documentation](https://documenter.getpostman.com/view/47791845/2sB3BLjnwi).

# Getting Started

Follow these steps to set up **LogiSick** locally.

# Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (>= 16.x)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

# Installation

1. #### Clone the repository:


   ```bash
   git clone https://github.com/GaurangTyagi123/logisick.git
   cd logisick

   ```
2. #### Install dependencies:

   #### For backend

   ``bash cd backend npm install ``

   #### For frontend

   ``bash cd ../frontend npm install ``
3. #### Configure environment variables:


   > Create a .env file in the backend folder with:
   >

```js
NODE_ENV = production
FRONTEND_URL = http://localhost:8000
PORT = 8000
DB_URL = <mongodb--prod-url>
DB_URL_DEV = <mongodb-dev-url>
REDIS_HOST = <redis-prod-url>
REDIS_PORT = <redis-prod-port>
REDIS_PASS = <redis-prod-pass>

JWT_SIGN = <jwt-sign>
JWT_REFRESH_EXPIRE_TIME = 1d // s->seconds | m-> minutes | d -> days | y->year
JWT_ACCESS_EXPIRE_TIME = 7d // s->seconds | m-> minutes | d -> days | y->year

COOKIE_EXPIRE_TIME = 7 // days
INVITE_EXPIRE_TIME = 1 // days

OTP_EXPIRE_TIME = 2 // days

DEV_MAIL_HOST = <mail-dev-host>
DEV_MAIL_PORT = <mail-dev-port>
DEV_MAIL_USER = <mail-dev-user>
DEV_MAIL_PASSWORD = <mail-dev-password>

OAUTH_CLIENT_ID = <google-oauth-client-id>
OAUTH_CLIENT_SECRET = <google-oauth-client-secret>
OAUTH_CALLBACK_URL = <google-oauth-callback>
SENDGRID_KEY=<sendgrid-mailing-api>
```

# Run the project (IN DEVELOPMENT):

#### Start backend & frontend

```bash
npm run dev
```

#### Access the app

> Visit [http://localhost:8000](http://localhost:8000) in your browser.

---

# License

Copyright (c) 2025 GaurangTyagi & RavishRanjan & ManasMore

All rights reserved.

This source code is made available for viewing and educational purposes only.
No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, or sell copies of this software, in whole or in part, without prior written permission from the author.

---

# Contact

For support or queries, reach out at [gaurangt.mca25@cs.du.ac.in](mailto:gaurangt.mca25@cs.du.ac.in) or [ravishr.mca25@cs.du.ac.in](mailto:ravishr.mca25@cs.du.ac.in)
