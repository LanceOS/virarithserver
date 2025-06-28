ALTER TABLE "followers" RENAME COLUMN "following_user_id" TO "sender_id";--> statement-breakpoint
ALTER TABLE "followers" RENAME COLUMN "followed_user_id" TO "reciever_id";--> statement-breakpoint
ALTER TABLE "followers" DROP CONSTRAINT "followers_following_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "followers" DROP CONSTRAINT "followers_followed_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "followed_user_id_idx_created_at_desc";--> statement-breakpoint
DROP INDEX "following_user_id_idx_created_at_desc";--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_reciever_id_user_id_fk" FOREIGN KEY ("reciever_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reciever_id_idx_created_at_desc" ON "followers" USING btree ("reciever_id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "sender_id_idx_created_at_desc" ON "followers" USING btree ("sender_id" DESC NULLS LAST);