# Fix Feedback Table Schema

Your feedback table is missing the `name` column and has some deprecated columns. Follow these steps to fix it:

## Option 1: Use Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project `lmginjwbrkdigtzcatlx`
3. Go to **SQL Editor**
4. Click **+ New Query**
5. Copy and paste this SQL:

```sql
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
```

6. Click **Run**
7. You should see "Success" message

## Option 2: Update the Original Schema

If you haven't created the table yet, delete the old table and recreate it with the correct schema.

In the Supabase dashboard:
1. Go to **Table Editor**
2. Find the `feedback` table
3. Click the menu (...) and select **Delete table**
4. Go to **SQL Editor** 
5. Run this SQL:

```sql
-- Create Feedback Table (Updated Schema)
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  overall_rating integer CHECK (overall_rating >= 1 AND overall_rating <= 5),
  organization_rating integer CHECK (organization_rating >= 1 AND organization_rating <= 5),
  venue_rating integer CHECK (venue_rating >= 1 AND venue_rating <= 5),
  mentorship_rating integer CHECK (mentorship_rating >= 1 AND mentorship_rating <= 5),
  networking_rating integer CHECK (networking_rating >= 1 AND networking_rating <= 5),
  food_rating integer CHECK (food_rating >= 1 AND food_rating <= 5),
  would_recommend boolean,
  return_next_year integer CHECK (return_next_year >= 1 AND return_next_year <= 5),
  highlights text,
  additional_comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Feedback is viewable by admins only" ON public.feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.user_id = auth.uid() 
      AND public.profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own feedback" ON public.feedback
  FOR UPDATE USING (user_id = auth.uid());
```

## After Running the Migration

Once you've run the migration, refresh your browser and try submitting the feedback form again. It should now work!

If you still get errors, check the browser console for details and let me know.
