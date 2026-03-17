import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export type Settings = {
  id: string;
  site_title: string;
  hero_heading: string;
  hero_subtitle: string;
  resume_url: string;
};

export type About = {
  id: string;
  title: string;
  description: string;
  profile_image: string;
};

export type Skill = {
  id: string;
  skill_name: string;
  category: string;
  icon: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[]; // Fixed type to match usage and SQL schema
  github_link: string;
  live_link: string;
  image: string;
  featured: boolean;
  is_visible: boolean;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
};

export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  certificate_url?: string;
};

export type Contact = {
  id: string;
  email: string;
  github: string;
  linkedin: string;
};
