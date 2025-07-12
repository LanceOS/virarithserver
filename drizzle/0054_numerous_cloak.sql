ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_flagged" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "report_by_user_desc" ON "reports" USING btree ("user_id" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "flagged";