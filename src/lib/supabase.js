import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://pqaxmjckirtxnihvxavq.supabase.co";

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_DHtpTZ0bLT0oCd1OCJxE-w_QuopmU7m";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
