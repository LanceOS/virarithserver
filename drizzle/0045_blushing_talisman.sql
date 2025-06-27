DROP INDEX "comments_post_id_created_at_index";--> statement-breakpoint
DROP INDEX "comments_created_at_index";--> statement-breakpoint
DROP INDEX "images_created_at_index";--> statement-breakpoint
DROP INDEX "images_user_id_index";--> statement-breakpoint
DROP INDEX "likes_created_at_desc";--> statement-breakpoint
DROP INDEX "post_created_at_desc_index";--> statement-breakpoint
DROP INDEX "post_user_id_created_at_desc_index";--> statement-breakpoint
DROP INDEX "post_category_created_at_desc_index";--> statement-breakpoint
DROP INDEX "profile_create_at_index";--> statement-breakpoint
DROP INDEX "profile_user_id_index";--> statement-breakpoint
CREATE INDEX "comments_post_id_created_at_index" ON "comments" USING btree ("post_id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "comments_created_at_index" ON "comments" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "images_created_at_index" ON "images" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "images_user_id_index" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "likes_created_at_desc" ON "likes" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "post_created_at_desc_index" ON "posts" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "post_user_id_created_at_desc_index" ON "posts" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "post_category_created_at_desc_index" ON "posts" USING btree ("category","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "profile_create_at_index" ON "profile" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "profile_user_id_index" ON "profile" USING btree ("user_id");