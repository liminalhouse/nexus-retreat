-- First, convert the columns to text to avoid enum constraint issues
ALTER TABLE "registrations" ALTER COLUMN "jacket_size" SET DATA TYPE text;
ALTER TABLE "registrations" ALTER COLUMN "guest_jacket_size" SET DATA TYPE text;

-- Update existing data to use new format (default to Men's for existing entries)
UPDATE "registrations" SET "jacket_size" = 'Men''s - XS' WHERE "jacket_size" = 'XS';
UPDATE "registrations" SET "jacket_size" = 'Men''s - Small' WHERE "jacket_size" = 'S';
UPDATE "registrations" SET "jacket_size" = 'Men''s - Medium' WHERE "jacket_size" = 'M';
UPDATE "registrations" SET "jacket_size" = 'Men''s - Large' WHERE "jacket_size" = 'L';
UPDATE "registrations" SET "jacket_size" = 'Men''s - XL' WHERE "jacket_size" = 'XL';
UPDATE "registrations" SET "jacket_size" = 'Men''s - XXL' WHERE "jacket_size" = 'XXL';

UPDATE "registrations" SET "guest_jacket_size" = 'Men''s - XS' WHERE "guest_jacket_size" = 'XS';
UPDATE "registrations" SET "guest_jacket_size" = 'Men''s - Small' WHERE "guest_jacket_size" = 'S';
UPDATE "registrations" SET "guest_jacket_size" = 'Men''s - Medium' WHERE "guest_jacket_size" = 'M';
UPDATE "registrations" SET "guest_jacket_size" = 'Men''s - Large' WHERE "guest_jacket_size" = 'L';
UPDATE "registrations" SET "guest_jacket_size" = 'Men''s - XL' WHERE "guest_jacket_size" = 'XL';
UPDATE "registrations" SET "guest_jacket_size" = 'Men''s - XXL' WHERE "guest_jacket_size" = 'XXL';

-- Drop the old enum type
DROP TYPE IF EXISTS "public"."jacket_size_enum";

-- Create the new enum with updated values
CREATE TYPE "public"."jacket_size_enum" AS ENUM(
  'Women''s - XS',
  'Women''s - Small',
  'Women''s - Medium',
  'Women''s - Large',
  'Women''s - XL',
  'Women''s - XXL',
  'Men''s - XS',
  'Men''s - Small',
  'Men''s - Medium',
  'Men''s - Large',
  'Men''s - XL',
  'Men''s - XXL'
);

-- Convert columns back to the new enum type
ALTER TABLE "registrations" ALTER COLUMN "jacket_size" SET DATA TYPE "public"."jacket_size_enum" USING "jacket_size"::"public"."jacket_size_enum";
ALTER TABLE "registrations" ALTER COLUMN "guest_jacket_size" SET DATA TYPE "public"."jacket_size_enum" USING "guest_jacket_size"::"public"."jacket_size_enum";
