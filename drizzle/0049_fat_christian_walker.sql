ALTER TABLE "followers" RENAME COLUMN "user_id" TO "following_user_id";--> statement-breakpoint
ALTER TABLE "followers" DROP CONSTRAINT "followers_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "followers_userId_created_at_desc";--> statement-breakpoint
ALTER TABLE "followers" ADD COLUMN "followed_user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "followers" ADD COLUMN "followerId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_user_id_user_id_fk" FOREIGN KEY ("following_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_followed_user_id_user_id_fk" FOREIGN KEY ("followed_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_followerId_user_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "followed_user_id_idx_created_at_desc" ON "followers" USING btree ("followed_user_id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "following_user_id_idx_created_at_desc" ON "followers" USING btree ("following_user_id" DESC NULLS LAST);