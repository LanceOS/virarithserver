ALTER TABLE "images" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX CONCURRENTLY "comments_post_id_created_at_index" ON "comments" USING btree ("post_id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY "comments_created_at_index" ON "comments" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY "images_created_at_index" ON "images" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY "images_user_id_index" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX CONCURRENTLY "profile_create_at_index" ON "profile" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX CONCURRENTLY "profile_user_id_index" ON "profile" USING btree ("user_id");