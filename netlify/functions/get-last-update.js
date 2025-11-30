import { createClient } from "@supabase/supabase-js";

export const handler = async () => {
  try {
    // Clés stockées dans les variables d'environnement Netlify
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

    // Supabase v2
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Récupérer la dernière mise à jour
    const { data, error } = await supabase
      .from("site_info")
      .select("dernier_maj")
      .eq("id", 1)
      .maybeSingle(); // v2 : maybeSingle() remplace single() si la ligne peut être vide

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dernier_maj: data?.dernier_maj || null }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};