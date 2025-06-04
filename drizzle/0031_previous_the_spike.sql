ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_comment_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_comment_reply_id_comment_reply_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "object_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "object_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "likes" DROP COLUMN "post_id";--> statement-breakpoint
ALTER TABLE "likes" DROP COLUMN "comment_id";--> statement-breakpoint
ALTER TABLE "likes" DROP COLUMN "comment_reply_id";