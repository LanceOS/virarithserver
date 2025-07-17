ALTER TABLE "notifications" RENAME COLUMN "receiverId" TO "reciever_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_receiverId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_reciever_id_user_id_fk" FOREIGN KEY ("reciever_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;