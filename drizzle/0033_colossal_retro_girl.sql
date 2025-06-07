ALTER TABLE "comment_reply" ADD COLUMN "is_edited" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "is_edited" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_edited" boolean DEFAULT false;