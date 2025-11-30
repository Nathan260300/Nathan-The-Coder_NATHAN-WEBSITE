import { createClient } from "@supabase/supabase-js";

export const handler = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { statusCode: 500, body: "Supabase env vars missing" };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Récupérer toutes les ressources, les plus récentes en premier
    const { data, error } = await supabase
      .from("changelog") 
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || []),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
