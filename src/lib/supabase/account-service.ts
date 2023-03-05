import { goto } from "$app/navigation";
import type { Account, AccountUpdate } from "./public-types";
import { getUserId, supabase } from "./supabase-client";

async function getDefaultCategory(): Promise<number> {
  const { data, error } = await supabase.from("accounts").select("default_category").single();

  if (error) {
    console.error("Can't get default category:", error);
    return -1;
  }

  return data.default_category || -1;
}

async function getAccount(): Promise<Account | undefined> {
  const userId = await getUserId();

  if (!userId) return;

  const { data, error } = await supabase.from("accounts").select().eq("id", userId).single();

  if (error) {
    console.error("Can't get account:", error);
    return;
  }

  return data;
}

async function updateAccount(update: AccountUpdate): Promise<string | undefined> {
  console.log("Update account:", update);
  const id = await getUserId();

  if (!id) {
    goto("/");
  }

  const { error } = await supabase.from("accounts").update(update).eq("id", id);

  if (error) {
    console.log("Can't update account:", error);
    if (error.code === "23505") {
      return "Benutzername bereits vergeben";
    }
  }
}

export default {
  getDefaultCategory,
  getAccount,
  updateAccount
};
