import { createClient } from "@supabase/supabase-js";

const supabaseURL = 'https://wwdnoklxfhjtnptnhsgx.supabase.co'
const supabaseAnnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZG5va2x4ZmhqdG5wdG5oc2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDY5NjksImV4cCI6MjA1OTA4Mjk2OX0.H1BIJxgAQbldzJoTVWun1-PZm6krPDZTTZL2P9zYBnI'

export const supabase = createClient(supabaseURL, supabaseAnnonKey);