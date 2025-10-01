# ![alt text](frontend/src/assets/icon@4x.png) LogiSick – Smart inventory and logistics management, all in one place.

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
  * Suppliers & Vendors
  * Supplier database
  * Contact info & order history
  * Preferred supplier tagging
* #### Analytics & Reporting

  * Dashboards
  * Total stock value
  * Fast-moving vs. slow-moving items
  * Out-of-stock alerts
  * Reports
  * Sales reports
  * Inventory aging report (stock nearing expiry)
  * Purchase history
* #### Order & Sales Features

  * Purchase Orders
  * Create and track purchase orders
  * Supplier confirmation status
  * Auto-stock update on delivery
  * Sales Orders
  * Customer order management
* #### User & Role Management

  * Access Control
  * Admin, Manager, Staff roles
  * Permissions for editing vs. view-only
  * Activity logs
* #### Advanced/Optional Features

  * QR Code Scanning
  * Integration with barcode scanners or camera-based scanning
  * Print qrcodes/labels for products
  * Multi-Warehouse Support
  * Manage stock across multiple warehouses/stores
  * Inter-warehouse transfers
  * Integrations
  * Accounting software (e.g., QuickBooks, Zoho Books)
  * Shipping & logistics APIs
  * Forecasting & Automation
  * Demand forecasting using historical sales
  * Auto-reorder suggestions
  * Mobile App or Responsive Web
  * Offline mode with sync
  * Security & Backup
  * Two-factor authentication
  * Daily/weekly backups
  * Data export (CSV/Excel/PDF)

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

   ```
       NODE_ENV = development
       PORT = 8000
       DB_URL = <mongodb database-url>
       JWT_SIGN = <jwt secret>
       JWT_EXPIRE_TIME = 30d
       COOKIE_EXPIRE_TIME = 2

       DEV_MAIL_HOST = <mail-host>
       DEV_MAIL_PORT = <mail-port>
       DEV_MAIL_USER = <mail-user-id>
       DEV_MAIL_PASSWORD = <mail-pass>

       OAUTH_CLIENT_ID = <oauth-client-id>
       OAUTH_CLIENT_SECRET = <oauth-client-secret>
       OAUTH_CALLBACK_URL = <oauth-callback-url>
   ```

   ---

# Run the project (IN DEVELOPMENT):

#### Start backend

```bash

    cd backend
    npm run dev
```

#### Start frontend

```bash

    cd ../frontend
    npm run dev:react

```

#### Access the app

> Visit [http://localhost:5173](http://localhost:5173) in your browser.

----

# License

Copyright (c) 2025 GaurangTyagi & RavishRanjan & ManasMore

All rights reserved.

This source code is made available for viewing and educational purposes only.
No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, or sell copies of this software, in whole or in part, without prior written permission from the author.

----

# Contact
For support or queries, reach out at [gaurangt.mca25@cs.du.ac.in](mailto:gaurangt.mca25@cs.du.ac.in) or [ravishr.mca25@cs.du.ac.in](mailto:ravishr.mca25@cs.du.ac.in)
