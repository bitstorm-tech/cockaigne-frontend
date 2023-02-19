import { supabase } from "./supabase-client";

async function getDefaultCategory(): Promise<number> {
  const { data, error } = await supabase.from("accounts").select("default_category").single();

  if (error) {
    console.error("Can't get default category:", error);
    return -1;
  }

  return data.default_category;
}

export default {
  getDefaultCategory
};
