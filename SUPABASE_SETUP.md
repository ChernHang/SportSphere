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

## Next Steps: Database (Optional)
If you wish to store user watchlists or preferences in Supabase:
1. Create a `profiles` table in the Supabase SQL Editor.
2. Enable Row Level Security (RLS) to ensure users can only access their own data.
3. Update `src/lib/supabase.ts` or create new services to interact with the database.
