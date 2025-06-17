CREATE TABLE "ghost_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Ghost User' NOT NULL,
	"email" text DEFAULT 'deleted@gmail.com' NOT NULL
);
