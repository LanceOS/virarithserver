ALTER TABLE "comment" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comment_reply" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reply" ADD CONSTRAINT "comment_reply_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;