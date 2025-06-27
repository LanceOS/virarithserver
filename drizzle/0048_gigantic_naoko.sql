CREATE TABLE "followers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"object_id" uuid NOT NULL,
	"object_type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "followers_userId_created_at_desc" ON "followers" USING btree ("user_id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "notifications_sender_created_at_desc" ON "notifications" USING btree ("sender_id" DESC NULLS LAST);