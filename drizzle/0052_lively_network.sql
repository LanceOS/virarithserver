ALTER TABLE "reports" ADD COLUMN "object_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "object_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "flagged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "num_of_reports";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "problematic";