# Yash Industries - Deployment Guide

This document outlines the exact steps to deploy the Yash Industries website (React/Vite frontend + PHP/MySQL backend) to a Hostinger Shared Hosting environment.

## 1. Database Setup
1. Log in to your Hostinger hPanel.
2. Go to **Databases -> MySQL Databases**.
3. Create a new database and user (e.g., `u123456789_yash`, `u123456789_user`). Save the password.
4. Click **Enter phpMyAdmin**.
5. Import the `api/schema.sql` file provided in this repository.
6. This script creates the `admins`, `products`, and `inquiries` tables and seeds the default admin user and existing products.

## 2. API Configuration
1. Open `api/config.php` locally or on the server.
2. If your server supports `.env` natively outside of public HTML, you can set the `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS` variables there.
3. Otherwise, for shared hosting, directly update `api/config.php` with the database credentials created in step 1.
4. Update the SMTP mail credentials in `api/config.php` to match your Hostinger Webmail configuration so quote notifications are sent reliably.

## 3. Frontend Production Build
1. On your local machine, open the terminal in the project root.
2. Run `npm install` to ensure all dependencies are up to date.
3. Run `npm run build`.
4. This will generate an optimized, minified production build in the `dist` folder.

## 4. Deployment to Hostinger
1. Open Hostinger's **File Manager** (or use FTP like FileZilla).
2. Navigate to your `public_html` directory.
3. Upload the *contents* of your local `dist` folder into `public_html`.
4. Next, upload the entire `api` folder from your local project into the root of `public_html`. 
   - You should end up with a structure like:
     - `public_html/assets/`
     - `public_html/api/`
     - `public_html/index.html`
5. The `api/.htaccess` file ensures that all API requests are routed securely to `api/index.php`.

## 5. Security Checklist
- Ensure `api/config.php` is not accessible from the browser directly. The `.htaccess` in the `api` folder protects against directory listing.
- The default admin account is `admin` with the password `Admin@Yash2026`. Log into `yoursite.com/admin` immediately and change this password in the database (or build out the password reset feature).
- Enable "Force HTTPS" in your Hostinger hPanel to ensure secure login and form submission.

## 6. Verification
- Go to `yoursite.com/admin` and log in. You should see the dashboard.
- Submit a quote on the public site and verify it appears in the admin dashboard.
- Update a product status in the admin dashboard and verify it disappears/reappears on the public Products section.
