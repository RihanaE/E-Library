🚀 Supabase Setup Guide
This guide details the steps required to connect your project to your Supabase backend, including how to set up your environment variables securely.

1. Retrieve Your Supabase Credentials
You need the Project URL and the Anon Public Key from your Supabase Dashboard.

Action: Log in to your Supabase project, navigate to Settings (⚙️) > API, and copy the two key values under Project Settings.

2. Configure Environment Variables
For security and ease of configuration, all sensitive credentials must be stored in a local environment file.

Filename: .env.local

Location: The root directory of your project (alongside package.json).

How to Add: Because your project uses Vite (as evidenced by your package.json and tsconfig.app.json), all public environment variables used in the frontend code must be prefixed with VITE_.

Create the .env.local file and add your credentials using this format:

Code snippet

# .env.local

# REQUIRED: Your Supabase Project URL
VITE_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"

# REQUIRED: Your Supabase Anon Public Key (safe for public use)
VITE_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
Security Note: Ensure your .env.local file is listed in your project's .gitignore file to prevent sensitive keys from being committed to your repository.

3. Initialize the Supabase Client
The environment variables are consumed in a dedicated client file, which is then imported wherever you need to interact with the database.

Filename: src/integrations/supabase/client.ts

Action: Ensure this file uses import.meta.env to securely access the variables and initialize the client:

TypeScript

// Inside src/integrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js";
// ... import types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
4. Construct the Database Schema
To set up your tables, roles, and security policies, you must run the provided SQL script in the Supabase web interface.

Filename: 20251212121724_2c688d91-7726-43c3-9215-ab8475215335.sql

Action:

Go to your Supabase Project Dashboard.

Click the SQL Editor icon (</>) in the left sidebar.

Click "New Query".

Copy the entire content of the 20251212121724_2c688d91-7726-43c3-9215-ab8475215335.sql file.

Paste the content into the SQL editor and click the "RUN" button to create your full database schema and RLS policies.
