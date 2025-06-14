ALTER TABLE "comments" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "category" SET DATA TYPE varchar(64);