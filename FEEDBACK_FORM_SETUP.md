# Feedback Survey Implementation

## Overview
A comprehensive feedback survey system has been implemented to collect participant feedback for the hackathon. This includes a public feedback form, admin dashboard, and database storage.

## Files Created

### 1. Database Migration
- **File**: [scripts/add_feedback_table.sql](scripts/add_feedback_table.sql)
- Creates a `feedback` table with the following fields:
  - User identification (user_id, email)
  - Rating scales (1-5) for: overall experience, organization, venue, mentorship, networking, food
  - Binary questions: would recommend, likelihood to return
  - Open-ended feedback: highlights, improvements, additional comments
  - Timestamps for tracking

### 2. Frontend Components

#### Feedback Form Component
- **File**: [app/components/FeedbackForm.tsx](app/components/FeedbackForm.tsx)
- Reusable form component with:
  - Interactive 5-point rating scales with visual feedback
  - Email collection
  - Multiple question types (ratings, binary, text areas)
  - Real-time form state management
  - Loading state handling

#### Feedback Page (Public)
- **File**: [app/feedback/page.tsx](app/feedback/page.tsx)
- Public-facing survey page where participants submit feedback
- Features:
  - Auto-populated email for logged-in users
  - Success message on submission
  - Auto-redirect to home page after submission
  - Clean, professional UI with gradient background

#### Admin Feedback Dashboard
- **File**: [app/admin/feedback/page.tsx](app/admin/feedback/page.tsx)
- Admin-only dashboard to view and analyze feedback
- Features:
  - Authentication checks (admin only)
  - Statistics overview:
    - Total responses count
    - Average overall rating
    - Recommendation percentage
    - Likelihood to return next year
  - Category rating breakdowns with visual progress bars
  - Individual feedback cards with all responses
  - Scrollable feedback list for easy browsing

### 3. API Endpoint
- **File**: [app/api/feedback/route.ts](app/api/feedback/route.ts)
- Handles feedback submission and retrieval
- POST: Submit new feedback
- GET: Retrieve all feedback (admin only)
- Full error handling and authentication checks

### 4. Navigation Updates
- **File**: [app/components/nvbar.tsx](app/components/nvbar.tsx) (modified)
- Added "Feedback" link to main navigation
- Added "Feedback" link to admin dashboard
- Properly integrated with existing navigation cube system

## How to Deploy

### 1. Run Database Migration
Execute the SQL migration in your Supabase dashboard:
```sql
-- Copy and run the contents of scripts/add_feedback_table.sql
```

### 2. Access the Feedback Form
- Public URL: `/feedback`
- Accessible to all participants
- Can be shared via email or social media

### 3. View Admin Dashboard
- Admin URL: `/admin/feedback`
- Only accessible to users with admin role
- Shows aggregate statistics and individual responses

## Survey Questions

The feedback form collects:

### Rating Scales (1-5)
- Overall Event Experience
- Organization & Event Management
- Venue & Facilities
- Mentorship & Support Quality
- Networking Opportunities
- Food & Refreshments
- Likelihood to participate next year

### Binary Question
- Would you recommend this hackathon to others? (Yes/No)

### Open-Ended Feedback
- What were the highlights of the event?
- What could we improve?
- Additional Comments

## Database Schema

```sql
feedback (
  id: uuid,
  user_id: uuid (nullable),
  email: text,
  overall_rating: integer (1-5),
  organization_rating: integer (1-5),
  venue_rating: integer (1-5),
  mentorship_rating: integer (1-5),
  networking_rating: integer (1-5),
  food_rating: integer (1-5),
  would_recommend: boolean,
  return_next_year: integer (1-5),
  highlights: text,
  improvements: text,
  additional_comments: text,
  created_at: timestamp,
  updated_at: timestamp
)
```

## Security

- Row Level Security (RLS) enabled on feedback table
- Public can insert feedback
- Only admins can view all feedback
- Authenticated users can update their own feedback

## Analytics & Statistics

The admin dashboard automatically calculates:
- Total number of responses
- Average ratings per category
- Percentage of recommenders
- Average return likelihood
- Visual progress bars for easy comparison

## Customization

To modify survey questions:
1. Update the FeedbackForm component fields
2. Update the feedback table schema (add/remove columns)
3. Update the API route to handle new fields
4. Update the admin dashboard to display new analytics

## Example Usage

1. User navigates to `/feedback`
2. Fills out the survey form with their email and ratings
3. Submits the form
4. Sees success message and is redirected home
5. Admin can view all responses at `/admin/feedback`
