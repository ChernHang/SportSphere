# Supabase Integration for SportSphere

This application is ready to be connected to Supabase for authentication (including Guest/Anonymous login).

## 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. Once the project is created, navigate to **Project Settings** > **API**.

## 2. Copy Credentials
Copy the following values:
- **Project URL** (e.g., `https://xyz.supabase.co`)
- **Anon Key** (The `public` key)

## 3. Configure Environment Variables
In the AI Studio **Secrets** panel (or your local `.env` file), set the following:
- `VITE_SUPABASE_URL`: (Your Project URL)
- `VITE_SUPABASE_ANON_KEY`: (Your Anon Key)

Note: In AI Studio, variables prefixed with `VITE_` are automatically exposed to the frontend.

## 4. Enable Auth Providers
1. Go to **Authentication** > **Providers**.
2. **Anonymous**: Toggle **Enable Anonymous Sign-ins** to ON. (Required for Guest login)
3. **Email**: Toggle **Enable Email provider** to ON. 
   - *Recommendation*: Toggle **Confirm email** to OFF for development to save time.
4. **Google**: Toggle **Enable Google provider** to ON.
   - You will need to provide a **Client ID** and **Client Secret** from the [Google Cloud Console](https://console.cloud.google.com/).
   - Copy the **Redirect URI** provided by Supabase and add it to your Google OAuth client settings.

## 5. Verify Connection
Once configured, the app will show a **Login Screen**. 
- You can sign up with a new email/password.
- You can sign in via Google.
- You can still use **Continue as Guest** if Anonymous Auth is enabled.

## 6. Setup Profiles Table (Admin Features)
To manage user roles and admin privileges, run this in your Supabase **SQL Editor**:

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  is_admin boolean default false,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handler on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TO MAKE YOURSELF AN ADMIN:
-- Run this replacing 'YOUR_USER_ID' with the ID from the Authentication > Users tab
-- update profiles set is_admin = true where id = 'YOUR_USER_ID';
```
