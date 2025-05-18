ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_reply" DROP CONSTRAINT "comment_reply_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "comment_reply" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "user_id";