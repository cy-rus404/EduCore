import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://<project_ref>.supabase.co'; // Replace with your Supabase URL
const supabaseKey = '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscHRsemtieXdwZ2VuaWR4emx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzcyNzgsImV4cCI6MjA1NzkxMzI3OH0.DBan-900AsZAf6WMcmdm8vSxJzTXhJzQBpR803UwcdE>'; // Replace with your anon key
export const supabase = createClient(supabaseUrl, supabaseKey);