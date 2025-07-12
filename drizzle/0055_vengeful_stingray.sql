ALTER TABLE "comment_reply" ADD COLUMN "is_flagged" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "is_flagged" boolean DEFAULT false;