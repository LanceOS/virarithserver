ALTER TABLE "comment_reply" DROP CONSTRAINT "comment_reply_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_reply" DROP COLUMN "user_id";