ALTER TABLE "notifications" RENAME COLUMN "user_id" TO "sender_id";--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "recievingUser" TO "recieverId";--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recievingUser_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recieverId_user_id_fk" FOREIGN KEY ("recieverId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;