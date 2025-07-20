DROP TABLE "ghost_user" CASCADE;--> statement-breakpoint
ALTER TABLE "topic" RENAME TO "category";--> statement-breakpoint
ALTER TABLE "category" RENAME COLUMN "topic" TO "category";