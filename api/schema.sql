CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100),
  `image_path` VARCHAR(255),
  `specifications` JSON,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `unique_id` VARCHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150),
  `product_id` INT NULL,
  `quantity` INT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Contacted', 'Quoted', 'Won', 'Lost') DEFAULT 'New',
  `internal_notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default admin account (password: Admin@Yash2026)
-- Hash generated via standard password_hash() using BCRYPT
INSERT INTO `admins` (`username`, `password_hash`) 
SELECT 'admin', '$2y$10$w09ZJ/E9f5W8G.G6/H8zRejI2aXb6bM6mH.KjUqTzW.n5O.YVqO6W' 
WHERE NOT EXISTS (SELECT 1 FROM `admins` WHERE `username` = 'admin');

-- Seed existing products
INSERT INTO `products` (`slug`, `name`, `description`, `category`, `image_path`, `is_published`) VALUES
('mcc-panel', 'MCC Panel', 'Motor Control Center panel for centralized motor control.', 'LV PANEL', '/images/mcc.jpg', 1),
('pcc-panel', 'PCC Panel', 'Power Control Center panel for main power distribution.', 'LV PANEL', '/images/pcc.jpg', 1),
('apfc-panel', 'APFC Panel', 'Automatic Power Factor Correction panel for energy efficiency.', 'LV PANEL', '/images/apfc.jpg', 1),
('distribution-boards', 'Distribution Boards', 'Customizable power distribution boards for various applications.', 'DISTRIBUTION', '/images/db.jpg', 1),
('vfd-panel', 'VFD Panel', 'Variable Frequency Drive panels for precise speed control.', 'DRIVES', '/images/vfd.jpg', 1),
('custom-control-panel', 'Custom Control Panel', 'Bespoke control panels tailored to your unique industrial requirements.', 'CUSTOM', '/images/custom.jpg', 1)
ON DUPLICATE KEY UPDATE `id`=`id`;
