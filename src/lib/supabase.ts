import { browser } from "$app/environment";
import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { AuthError, createClient } from "@supabase/supabase-js";

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_API_KEY);
const BUCKET_DEALER_IMAGES = "dealer-images";
const BUCKET_PROFILE_IMAGES = "profile-images";

export function translateError(error: AuthError): string {
  switch (error.status) {
    case 400:
      return "E-Mail und/oder Passwort falsch oder dein Account ist noch nicht aktiviert";
    case 401:
      return "Der Aktivierungscode ist falsch";
    case 404:
      return "Es scheint so, als wärst du noch nicht registriert";
    case 422:
      return error.message.toLowerCase().includes("password")
        ? "Das Passwort muss mindestens aus 6 Zeichen bestehen"
        : "Format der E-Mail ist ungültig";
    default:
      return `${error.message} (${error.status})`;
  }
}

export async function getUserId(): Promise<string | undefined> {
  const { error, data } = await supabase.auth.getSession();

  if (error) {
    console.log("Can't get user id:", error);
    return;
  }

  return data.session?.user.id;
}

export async function saveDealerImage(image: File): Promise<string | undefined> {
  const id = await getUserId();
  const filename = new Date().getTime() + "." + image.name.split(".").pop();

  const { error } = await supabase.storage.from(BUCKET_DEALER_IMAGES).upload(id + "/" + filename, image);

  if (!error) {
    const { data } = supabase.storage.from(BUCKET_DEALER_IMAGES).getPublicUrl(id + "/" + filename);
    return data.publicUrl;
  }
}

export async function deleteDealerImage(filename: string) {
  const id = await getUserId();
  await supabase.storage.from(BUCKET_DEALER_IMAGES).remove([id + "/" + filename]);
}

export async function getAllDealerImageUrls(dealerId: string): Promise<string[]> {
  const { data } = await supabase.storage.from(BUCKET_DEALER_IMAGES).list(dealerId);

  if (data) {
    return data.map(
      (fileObject) =>
        supabase.storage.from(BUCKET_DEALER_IMAGES).getPublicUrl(dealerId + "/" + fileObject.name).data.publicUrl
    );
  }

  return [];
}

export async function getProfileImage(id: string, isDealer = false): Promise<string> {
  const { data } = await supabase.storage.from(BUCKET_PROFILE_IMAGES).list(undefined, { search: id });
  const filename = data?.pop()?.name;

  if (filename) {
    return supabase.storage.from(BUCKET_PROFILE_IMAGES).getPublicUrl(filename).data.publicUrl;
  }

  return isDealer ? "/images/anonym-profile-dealer.png" : "/images/anonym-profile.png";
}

supabase.auth.onAuthStateChange((event, session) => {
  if (!browser) {
    return;
  }

  if (event === "SIGNED_OUT" || event === "USER_DELETED") {
    // delete cookies on sign out
    const expires = new Date(0).toUTCString();
    document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
  } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    const maxAge = 5 * 24 * 60 * 60; // 5 days
    document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
  }
});
