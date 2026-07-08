-- FACEMAX AI SUPABASE SCHEMA SETUP (TRANSACTIONAL PAY-PER-REPORT)
-- Copy and run these queries in your Supabase SQL Editor.

-- 1. Create 'users' table linking to auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'payments' billing logs table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  payment_id TEXT,
  amount INTEGER NOT NULL, -- in paise (4900 or 9900)
  assessment_type TEXT NOT NULL, -- QUICK or COMPLETE
  status TEXT NOT NULL, -- PENDING, COMPLETED, FAILED
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'reports' high-level metadata table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- QUICK or COMPLETE
  overall_score INTEGER NOT NULL,
  face_shape TEXT NOT NULL,
  top_strengths JSONB NOT NULL, -- Array of strings
  top_improvement_areas JSONB NOT NULL, -- Array of strings
  daily_routine JSONB NOT NULL, -- Detailed daily routine objects
  improvement_plan_30_days JSONB NOT NULL, -- Day-by-day plan objects
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'face_scores' detailed visual parameter table
CREATE TABLE public.face_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  symmetry_score INTEGER NOT NULL,
  skin_glow INTEGER NOT NULL,
  skin_hydration INTEGER NOT NULL,
  skin_details JSONB NOT NULL,      -- Rating + Observation parameters
  eyes_details JSONB NOT NULL,
  eyebrows_details JSONB NOT NULL,
  nose_details JSONB NOT NULL,
  lips_details JSONB NOT NULL,
  jawline_details JSONB NOT NULL,
  chin_details JSONB NOT NULL,
  cheekbones_details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create 'recommendations' styling matching blueprint table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  items JSONB NOT NULL, -- Array of: { feature, observation, contributingFactors, suggestions, timeline }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Setup automatic trigger profile creation on auth.users SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
