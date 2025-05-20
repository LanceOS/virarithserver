ALTER TABLE "comment_reply" RENAME COLUMN "comment" TO "content";--> statement-breakpoint
ALTER TABLE "comment_reply" ADD COLUMN "parent_comment" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comment_reply" ADD CONSTRAINT "comment_reply_parent_comment_comment_id_fk" FOREIGN KEY ("parent_comment") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;