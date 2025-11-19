-- Add edit_token column as nullable first
ALTER TABLE "registrations" ADD COLUMN "edit_token" text;--> statement-breakpoint

-- Generate unique tokens for existing records
UPDATE "registrations" SET "edit_token" = gen_random_uuid()::text WHERE "edit_token" IS NULL;--> statement-breakpoint

-- Now make it NOT NULL
ALTER TABLE "registrations" ALTER COLUMN "edit_token" SET NOT NULL;--> statement-breakpoint

-- Add unique constraint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_edit_token_unique" UNIQUE("edit_token");