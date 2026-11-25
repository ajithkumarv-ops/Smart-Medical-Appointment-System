-- Smart Medical Appointment & Queue Management System Schema
-- Supabase PostgreSQL Migration Script

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Departments Table
create table if not exists public.departments (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  icon text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.departments enable row level security;
create policy "Allow public read access to departments" on public.departments for select using (true);
create policy "Allow admin write access to departments" on public.departments for all using (
  auth.jwt() ->> 'email' in (select email from public.profiles where role = 'admin')
);

-- 2. Profiles Table (Extends Supabase Auth Users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'doctor', 'reception', 'patient')),
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Allow read access to profiles for authenticated users" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Allow users to update their own profile" on public.profiles for update using (auth.uid() = id);

-- 3. Doctors Table (Extends profiles for doctor role)
create table if not exists public.doctors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  full_name text not null,
  specialty text not null,
  qualification text not null,
  experience_years integer not null default 0,
  bio text,
  avatar_url text,
  department_id uuid references public.departments(id) on delete set null,
  is_available boolean default true not null,
  consultation_fee numeric(10, 2) not null default 0.00,
  rating numeric(3, 2) default 5.00 not null,
  total_reviews integer default 0 not null,
  available_days text[] default '{}'::text[] not null,
  available_slots text[] default '{}'::text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.doctors enable row level security;
create policy "Allow public read access to doctors" on public.doctors for select using (true);
create policy "Allow admin/doctor write access to doctors" on public.doctors for all using (auth.role() = 'authenticated');

-- 4. Patients Table (Extends profiles for patient role)
create table if not exists public.patients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  full_name text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  blood_group text,
  phone text not null,
  address text,
  emergency_contact text,
  medical_history text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.patients enable row level security;
create policy "Allow read access to patients for medical staff and own patient" on public.patients for select using (
  auth.role() = 'authenticated'
);
create policy "Allow patient/admin write access to patients" on public.patients for all using (auth.role() = 'authenticated');

-- 5. Appointments Table
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  department_id uuid references public.departments(id) on delete set null,
  appointment_date date not null,
  appointment_time text not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  reason text,
  notes text,
  queue_number integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;
create policy "Allow read access to appointments for authenticated users" on public.appointments for select using (auth.role() = 'authenticated');
create policy "Allow all CRUD operations to admin/reception/patient" on public.appointments for all using (auth.role() = 'authenticated');

-- 6. Queue Table
create table if not exists public.queue_entries (
  id uuid default gen_random_uuid() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null unique,
  queue_number integer not null,
  status text not null default 'waiting' check (status in ('waiting', 'called', 'in_progress', 'done', 'skipped')),
  check_in_time timestamp with time zone default timezone('utc'::text, now()),
  called_time timestamp with time zone,
  estimated_wait_minutes integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.queue_entries enable row level security;
create policy "Allow read access to queue entries for everyone" on public.queue_entries for select using (true);
create policy "Allow staff write access to queue entries" on public.queue_entries for all using (auth.role() = 'authenticated');

-- 7. Notifications Table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Allow users to manage their own notifications" on public.notifications for all using (auth.uid() = user_id);

-- 8. Medical History Records
create table if not exists public.medical_history (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  diagnosis text not null,
  prescription text not null,
  followup_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.medical_history enable row level security;
create policy "Allow read access to history for own patient and staff" on public.medical_history for select using (auth.role() = 'authenticated');
create policy "Allow doctors to insert medical history records" on public.medical_history for insert with check (
  auth.jwt() ->> 'email' in (select email from public.profiles where role = 'doctor')
);

-- Seed Initial Departments Data
insert into public.departments (name, description, icon, color) values
('Cardiology', 'Heart & cardiovascular diseases', '❤️', 'from-red-500 to-rose-600'),
('Neurology', 'Brain & nervous system disorders', '🧠', 'from-purple-500 to-violet-600'),
('Orthopedics', 'Bone & joint conditions', '🦴', 'from-blue-500 to-sky-600'),
('Dermatology', 'Skin, hair & nail conditions', '🌸', 'from-pink-500 to-rose-500'),
('General', 'General medicine & primary care', '🏥', 'from-green-500 to-emerald-600'),
('Pediatrics', 'Children\'s healthcare', '👶', 'from-yellow-500 to-amber-500'),
('Emergency', 'Emergency & trauma care', '🚨', 'from-orange-500 to-red-500')
on conflict (name) do nothing;
