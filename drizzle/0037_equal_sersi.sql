CREATE INDEX CONCURRENTLY "likes_created_at_desc" ON "likes" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY "post_created_at_desc_index" ON "posts" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY "post_user_id_created_at_desc_index" ON "posts" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX CONCURRENTLY "post_category_created_at_desc_index" ON "posts" USING btree ("category","created_at" DESC NULLS LAST);