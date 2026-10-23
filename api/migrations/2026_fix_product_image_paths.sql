-- ============================================================
-- Migration: 2026_fix_product_image_paths.sql
-- Purpose: Correct product image paths in existing databases.
--
-- Apply this manually to the hosted MySQL database via phpMyAdmin
-- or a MySQL client. Committing this file to GitHub does NOT run it.
-- This migration only replaces the known stale seed paths.
-- ============================================================

UPDATE `products`
SET `image_path` = CASE LOWER(TRIM(`image_path`))
  WHEN '/images/mcc.jpg' THEN '/images/mcc_panel_1791435907074.jpg'
  WHEN '/images/pcc.jpg' THEN '/images/pcc_panel_1791435921126.jpg'
  WHEN '/images/apfc.jpg' THEN '/images/apfc_panel_1791435963764.jpg'
  WHEN '/images/db.jpg' THEN '/images/distribution_board_1791435976000.jpg'
  WHEN '/images/vfd.jpg' THEN '/images/vfd_panel_1791435937888.jpg'
  WHEN '/images/custom.jpg' THEN '/images/control_panel_1791435990845.jpg'
  ELSE `image_path`
END
WHERE LOWER(TRIM(`image_path`)) IN (
  '/images/mcc.jpg',
  '/images/pcc.jpg',
  '/images/apfc.jpg',
  '/images/db.jpg',
  '/images/vfd.jpg',
  '/images/custom.jpg'
);
