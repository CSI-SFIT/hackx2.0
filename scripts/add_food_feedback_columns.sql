-- Add Food-Related Columns to Existing Feedback Table
-- Run this migration if you already have the feedback table from add_feedback_table.sql

ALTER TABLE public.feedback 
ADD COLUMN IF NOT EXISTS food_quality integer CHECK (food_quality >= 1 AND food_quality <= 5),
ADD COLUMN IF NOT EXISTS food_variety integer CHECK (food_variety >= 1 AND food_variety <= 5),
ADD COLUMN IF NOT EXISTS dietary_options text CHECK (dietary_options IN ('yes', 'no', 'n/a')),
ADD COLUMN IF NOT EXISTS food_quantity text CHECK (food_quantity IN ('insufficient', 'adequate', 'sufficient'));
