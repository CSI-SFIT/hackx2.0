-- Migration: Update feedback table schema
-- Adds name column and removes deprecated columns

-- Add name column if it doesn't exist
ALTER TABLE public.feedback
ADD COLUMN IF NOT EXISTS name text;

-- Remove deprecated columns if they exist
ALTER TABLE public.feedback
DROP COLUMN IF EXISTS food_quality;

ALTER TABLE public.feedback
DROP COLUMN IF EXISTS food_variety;

ALTER TABLE public.feedback
DROP COLUMN IF EXISTS improvements;

ALTER TABLE public.feedback
DROP COLUMN IF EXISTS dietary_options;

ALTER TABLE public.feedback
DROP COLUMN IF EXISTS food_quantity;
