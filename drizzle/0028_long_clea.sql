ALTER TABLE "reports" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "topic" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();