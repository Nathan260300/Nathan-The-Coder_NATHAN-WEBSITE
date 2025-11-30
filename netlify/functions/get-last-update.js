import { createClient } from "@supabase/supabase-js";

export const handler = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // clé publishable

    if (!supabaseUrl || !supabaseAnonKey) {
      return { statusCode: 500, body: "Supabase env vars missing" };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("site_info")
      .select("dernier_maj")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dernier_maj: data?.dernier_maj || null }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
