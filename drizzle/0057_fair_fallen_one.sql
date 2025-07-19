CREATE TABLE "archived" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"archiver" text NOT NULL,
	"object_id" uuid NOT NULL,
	"object_type" text NOT NULL,
	"archived_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "archived" ADD CONSTRAINT "archived_archiver_user_id_fk" FOREIGN KEY ("archiver") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "archived_at_index" ON "archived" USING btree ("archived_at" DESC NULLS LAST);