import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://muxjnzfyrorvxgmbtdvx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jWzkdrfp_C6TUGC9BgmXiw_dYILgbg1';

export const supabase = createClient(supabaseUrl, supabaseKey);
