ALTER TABLE "chat_passwords" ADD COLUMN "reset_token" text;--> statement-breakpoint
ALTER TABLE "chat_passwords" ADD COLUMN "reset_token_expires_at" timestamp;