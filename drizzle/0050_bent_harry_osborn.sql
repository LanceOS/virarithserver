ALTER TABLE "followers" DROP CONSTRAINT "followers_followerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "followers" DROP COLUMN "followerId";