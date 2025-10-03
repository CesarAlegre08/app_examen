-- Create exam_submissions table to store all exam attempts
create table if not exists public.exam_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  score numeric not null,
  total_time_seconds integer not null,
  completed_at timestamptz not null default now(),
  answers jsonb not null
);

-- Create index on email for faster lookups
create index if not exists idx_exam_submissions_email on public.exam_submissions(email);
create index if not exists idx_exam_submissions_completed_at on public.exam_submissions(completed_at desc);

-- Enable RLS
alter table public.exam_submissions enable row level security;

-- Policy: Anyone can insert their own submission
create policy "Anyone can submit exam"
  on public.exam_submissions for insert
  with check (true);

-- Policy: Only authenticated users can view all submissions (for admin)
create policy "Authenticated users can view all submissions"
  on public.exam_submissions for select
  using (auth.uid() is not null);
