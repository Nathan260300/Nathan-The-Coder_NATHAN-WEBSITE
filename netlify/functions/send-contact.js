import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { statusCode: 500, body: "Supabase env vars missing" };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const body = JSON.parse(event.body || "{}");
    const { name, email, message } = body;

    if (!name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and message are required" }),
      };
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        { name, email, message, created_at: new Date().toISOString() },
      ]);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};