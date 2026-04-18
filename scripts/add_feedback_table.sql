-- Create Feedback Table for Participant Surveys

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  overall_rating integer CHECK (overall_rating >= 1 AND overall_rating <= 5),
  organization_rating integer CHECK (organization_rating >= 1 AND organization_rating <= 5),
  venue_rating integer CHECK (venue_rating >= 1 AND venue_rating <= 5),
  mentorship_rating integer CHECK (mentorship_rating >= 1 AND mentorship_rating <= 5),
  networking_rating integer CHECK (networking_rating >= 1 AND networking_rating <= 5),
  food_rating integer CHECK (food_rating >= 1 AND food_rating <= 5),
  food_quality integer CHECK (food_quality >= 1 AND food_quality <= 5),
  food_variety integer CHECK (food_variety >= 1 AND food_variety <= 5),
  dietary_options text CHECK (dietary_options IN ('yes', 'no', 'n/a')),
  food_quantity text CHECK (food_quantity IN ('insufficient', 'adequate', 'sufficient')),
  would_recommend boolean,
  return_next_year integer CHECK (return_next_year >= 1 AND return_next_year <= 5),
  highlights text,
  improvements text,
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
  FOR UPDATE USING (user_id = auth.uid() OR email = current_setting('request.jwt.claims', true)::jsonb->>'email');
