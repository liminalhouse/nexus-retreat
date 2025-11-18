-- Complete migration for registrations table
-- Run this in Supabase SQL Editor

-- Create the jacket size enum
CREATE TYPE "public"."jacket_size_enum" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- Create the registrations table
CREATE TABLE "public"."registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"title" text,
	"organization" text,
	"mobile_phone" text NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip" text NOT NULL,
	"country" text NOT NULL,
	"emergency_contact_name" text NOT NULL,
	"emergency_contact_relation" text,
	"emergency_contact_email" text NOT NULL,
	"emergency_contact_phone" text NOT NULL,
	"assistant_name" text,
	"assistant_title" text,
	"assistant_email" text,
	"assistant_phone" text,
	"guest_name" text,
	"guest_relation" text,
	"guest_email" text,
	"dietary_restrictions" text,
	"jacket_size" "public"."jacket_size_enum",
	"accommodations" jsonb,
	"dinner_attendance" jsonb,
	"activities" jsonb,
	"guest_dietary_restrictions" text,
	"guest_jacket_size" "public"."jacket_size_enum",
	"guest_accommodations" jsonb,
	"guest_dinner_attendance" jsonb,
	"guest_activities" jsonb,
	CONSTRAINT "registrations_email_unique" UNIQUE("email")
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert (from API for user registrations)
CREATE POLICY "Enable insert for service role" ON public.registrations
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only allow service role to read/update/delete (for admin access)
CREATE POLICY "Enable read for service role" ON public.registrations
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable update for service role" ON public.registrations
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable delete for service role" ON public.registrations
  FOR DELETE
  USING (auth.role() = 'service_role');
