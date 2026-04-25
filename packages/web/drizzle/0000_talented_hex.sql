CREATE TABLE `capture_chunk` (
	`id` text PRIMARY KEY NOT NULL,
	`captureId` text NOT NULL,
	`content` text NOT NULL,
	`embedding` F32_BLOB(384) NOT NULL,
	FOREIGN KEY (`captureId`) REFERENCES `capture`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `capture` (
	`id` text PRIMARY KEY NOT NULL,
	`created` text DEFAULT (CURRENT_DATE),
	`content` text NOT NULL,
	`embedding` F32_BLOB(384) NOT NULL,
	`type` text NOT NULL,
	`url` text,
	`enabled` integer DEFAULT true NOT NULL,
	`storeId` text NOT NULL,
	FOREIGN KEY (`storeId`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`workspaceId` text NOT NULL,
	FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `store_name_unique` ON `store` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `store_name_workspaceId_unique` ON `store` (`name`,`workspaceId`);--> statement-breakpoint
CREATE TABLE `workspace` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspace_name_unique` ON `workspace` (`name`);