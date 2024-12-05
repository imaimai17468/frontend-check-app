CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `team_confirmations` (
	`id` text PRIMARY KEY NOT NULL,
	`notification_id` text NOT NULL,
	`team_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`confirmed_at` integer,
	FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slack_mention` text NOT NULL
);
