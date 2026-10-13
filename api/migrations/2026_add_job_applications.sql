-- ============================================================
--  Migration: 2026_add_job_applications.sql
--  Purpose  : Add the job_applications table to an existing
--             Yash Industries MySQL database.
--
--  IMPORTANT: This migration must be applied manually to the
--  hosted MySQL database before the new job-application API
--  route is used. Updating this file in the repository does
--  NOT automatically alter a running database.
--
--  To apply:
--    mysql -u <db_user> -p <db_name> < api/migrations/2026_add_job_applications.sql
--  Or paste the statement below into phpMyAdmin SQL console.
-- ============================================================

CREATE TABLE IF NOT EXISTS `job_applications` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `app_ref`    VARCHAR(20)  NOT NULL UNIQUE
                COMMENT 'Human-readable application reference, e.g. APP-ABCD1234',
  `name`       VARCHAR(150) NOT NULL,
  `email`      VARCHAR(150) NOT NULL,
  `phone`      VARCHAR(30)  NOT NULL,
  `location`   VARCHAR(150)          COMMENT 'Current city/location — optional',
  `position`   VARCHAR(100) NOT NULL COMMENT 'Role or area of interest selected by the applicant',
  `experience` ENUM('Fresher','1–3 years','3–5 years','5+ years') NOT NULL,
  `resume_url` VARCHAR(500)          COMMENT 'Optional portfolio or LinkedIn URL provided by applicant',
  `message`    TEXT         NOT NULL COMMENT 'Short introduction / cover note',
  `status`     ENUM('New','Reviewing','Shortlisted','Rejected') NOT NULL DEFAULT 'New',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ja_status  (`status`),
  INDEX idx_ja_created (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores job applications submitted through the website career form';
