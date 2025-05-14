import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_KEY")!;

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
);