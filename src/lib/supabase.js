import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://teufwhvkfjluawtcvjwh.supabase.co";

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_yWyeVy6oGOgIPjzVb6hpWA_Hk4Korw9";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
