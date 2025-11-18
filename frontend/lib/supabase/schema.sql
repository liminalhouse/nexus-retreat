-- Create registrations table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Form data (you can customize these fields based on your form)
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,

  -- Store all form data as JSON for flexibility
  form_data JSONB NOT NULL,

  -- Metadata
  form_id TEXT DEFAULT 'register',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations(email);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS registrations_form_id_idx ON registrations(form_id);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for form submissions)
CREATE POLICY "Allow public form submissions"
ON registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to read all registrations (for admin)
CREATE POLICY "Allow authenticated users to read registrations"
ON registrations FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to update registrations (for admin)
CREATE POLICY "Allow authenticated users to update registrations"
ON registrations FOR UPDATE
TO authenticated
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE
ON registrations FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
