CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"content" text NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_passwords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"reset_token" text,
	"reset_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_passwords_registration_id_unique" UNIQUE("registration_id")
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_id" uuid NOT NULL,
	"token" text NOT NULL,
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "chat_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "rsvp_guest_luncheon" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "hide_in_chat" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "no_confirmation_email" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "arrival" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "departure" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "rooms" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "hotel_full_name" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "confirmation_number" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "room_guest" text;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_registrations_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_receiver_id_registrations_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_passwords" ADD CONSTRAINT "chat_passwords_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;