ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN "user_id";