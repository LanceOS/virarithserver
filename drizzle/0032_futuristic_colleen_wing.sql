ALTER TABLE "comment_reply" ADD COLUMN "type" text DEFAULT 'commentReply' NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "type" text DEFAULT 'comment' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" text DEFAULT 'notification' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "type" text DEFAULT 'post' NOT NULL;