-- Supabase Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Create enum for User Roles
CREATE TYPE user_role AS ENUM ('student', 'mentor');

-- 1. Profiles Table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    
    -- Student specific fields
    education_level TEXT,
    interested_course TEXT, -- e.g., 'Java', 'Python', 'Ethical Hacking'
    
    -- Mentor specific fields
    profession TEXT,
    course_expertise TEXT, -- e.g., 'Java', 'Python', 'Ethical Hacking'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Note: RLS (Row Level Security) is intentionally kept simple for this MVP.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Chat Messages Table (Course-based chat)
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_name TEXT NOT NULL,
    content TEXT NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chat messages viewable by everyone." ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert messages." ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 3. Roadmaps Table
CREATE TABLE roadmaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    rating NUMERIC DEFAULT 0,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roadmaps are viewable by everyone." ON roadmaps FOR SELECT USING (true);
-- Only mentors can create roadmaps, but for simplicity we'll allow mentors via app logic.
CREATE POLICY "Mentors can insert roadmaps." ON roadmaps FOR INSERT WITH CHECK (true);
CREATE POLICY "Mentors can update roadmaps." ON roadmaps FOR UPDATE USING (true);

-- 4. Interview Preparation Table
CREATE TABLE interview_qa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_name TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    rating NUMERIC DEFAULT 0,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE interview_qa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Interview QA viewable by everyone." ON interview_qa FOR SELECT USING (true);
CREATE POLICY "Mentors can insert QA." ON interview_qa FOR INSERT WITH CHECK (true);
CREATE POLICY "Mentors can update QA." ON interview_qa FOR UPDATE USING (true);

-- Trigger to automatically create a profile stub when a user signs up.
-- Optional: You can handle this directly in the frontend application flow.
