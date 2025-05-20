ALTER TABLE "comment" ADD COLUMN "post_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN "title";