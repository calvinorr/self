CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`mood` text,
	`ai_insight` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
