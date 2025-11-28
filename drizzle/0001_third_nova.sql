-- Add user_id column with default for existing entries
ALTER TABLE `entries` ADD `user_id` text DEFAULT 'legacy_user';
-- For new entries, this will be set by the application