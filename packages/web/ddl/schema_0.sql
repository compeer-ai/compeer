CREATE TABLE IF NOT EXISTS `capture_chunk` (
	`id` text PRIMARY KEY NOT NULL,
	`captureId` text NOT NULL,
	`content` text NOT NULL,
	`embedding` F32_BLOB(384) NOT NULL,
	FOREIGN KEY (`captureId`) REFERENCES `capture`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `capture` (
	`id` text PRIMARY KEY NOT NULL,
	`created` text DEFAULT (CURRENT_DATE),
	`content` text NOT NULL,
	`embedding` F32_BLOB(384) NOT NULL,
	`type` text NOT NULL,
	`url` text,
	`enabled` integer DEFAULT true NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`projectId` text NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`workspaceId` text NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `workspace` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
