ALTER TABLE "notifications" RENAME COLUMN "post_id" TO "object_id";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "comment_id" TO "object_type";--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_comment_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_comment_reply_id_comment_reply_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "comment_reply_id";