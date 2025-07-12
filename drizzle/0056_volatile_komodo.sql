ALTER TABLE "followers" RENAME COLUMN "reciever_id" TO "receiver_id";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "reciever_id" TO "receiver_id";--> statement-breakpoint
ALTER TABLE "followers" DROP CONSTRAINT "followers_reciever_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_reciever_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "reciever_id_idx_created_at_desc";--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "receiver_id_idx_created_at_desc" ON "followers" USING btree ("receiver_id" DESC NULLS LAST);