CREATE TYPE "public"."jacket_size_enum" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL');--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "mobile_phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "address_line_1" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "zip" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "emergency_contact_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "emergency_contact_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "emergency_contact_phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "jacket_size" SET DATA TYPE "public"."jacket_size_enum" USING "jacket_size"::"public"."jacket_size_enum";--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "accommodations" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "dinner_attendance" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "activities" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "guest_jacket_size" SET DATA TYPE "public"."jacket_size_enum" USING "guest_jacket_size"::"public"."jacket_size_enum";--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "guest_accommodations" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "guest_dinner_attendance" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "guest_activities" SET DATA TYPE jsonb;