ALTER TABLE "profile" ALTER COLUMN "bio" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "discord_name" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "minecraft_name" text;