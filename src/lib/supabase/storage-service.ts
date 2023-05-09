import { v4 as uuid } from "uuid";
import { getUserId, supabase, type Supabase } from "./supabase-client";

const BUCKET_DEALER_IMAGES = "dealer-images";
const BUCKET_PROFILE_IMAGES = "profile-images";
const BUCKET_DEAL_IMAGES = "deal-images";

const DEFAULT_DEALER_PROFILE_IMAGE_URL = "/images/anonym-profile-dealer.png";
const DEFAULT_USER_PROFILE_IMAGE_URL = "/images/anonym-profile.png";

function generateRandomFilename(file: File) {
  return uuid() + "." + file.name.split(".").pop();
}

export async function saveImage(
  supabase: Supabase,
  file: File,
  bucket: string,
  filename: string,
  folder?: string
): Promise<string | undefined> {
  const path = folder ? folder + "/" + filename : filename;

  const { error } = await supabase.storage.from(bucket).upload(path, file);

  if (!error) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  console.log("Can't save image:", error);
}

export async function saveProfileImage(supabase: Supabase, userId: string, image: File): Promise<string | undefined> {
  const { data } = await supabase.storage.from(BUCKET_PROFILE_IMAGES).list(userId);

  if (data && data.length > 0) {
    await supabase.storage.from(BUCKET_PROFILE_IMAGES).remove(data.map((fileObject) => `${userId}/${fileObject.name}`));
  }

  const filename = generateRandomFilename(image);

  return await saveImage(supabase, image, BUCKET_PROFILE_IMAGES, filename, userId);
}

export async function saveDealerImage(supabase: Supabase, userId: string, image: File): Promise<string | undefined> {
  const filename = generateRandomFilename(image);

  return await saveImage(supabase, image, BUCKET_DEALER_IMAGES, filename, userId);
}

export async function deleteDealerImage(supabase: Supabase, userId: string, filename: string) {
  await supabase.storage.from(BUCKET_DEALER_IMAGES).remove([userId + "/" + filename]);
}

export async function getDealerImages(supabase: Supabase, dealerId: string): Promise<string[]> {
  const { data } = await supabase.storage.from(BUCKET_DEALER_IMAGES).list(dealerId);

  if (data) {
    return data.map(
      (fileObject) =>
        supabase.storage.from(BUCKET_DEALER_IMAGES).getPublicUrl(dealerId + "/" + fileObject.name).data.publicUrl
    );
  }

  return [];
}

export async function getProfileImage(supabase: Supabase, userId?: string, isDealer = false): Promise<string> {
  if (!userId) {
    console.log("Can't get profile image -> unknown user");
    return isDealer ? DEFAULT_DEALER_PROFILE_IMAGE_URL : DEFAULT_USER_PROFILE_IMAGE_URL;
  }

  const { data } = await supabase.storage.from(BUCKET_PROFILE_IMAGES).list(userId);
  const filename = data?.pop()?.name;

  if (filename) {
    return supabase.storage.from(BUCKET_PROFILE_IMAGES).getPublicUrl(userId + "/" + filename).data.publicUrl;
  }

  return isDealer ? DEFAULT_DEALER_PROFILE_IMAGE_URL : DEFAULT_USER_PROFILE_IMAGE_URL;
}

export async function getDealImages(supabase: Supabase, dealId: string, dealerId: string): Promise<string[]> {
  const path = `${dealerId}/${dealId}`;
  const { data, error } = await supabase.storage.from(BUCKET_DEAL_IMAGES).list(path);

  if (error) {
    console.log("Can't get deal images:", error);
    return [];
  }

  const filenames = data?.map((fileObject) => `${path}/${fileObject.name}`);
  return filenames.map((filename) => supabase.storage.from(BUCKET_DEAL_IMAGES).getPublicUrl(filename).data.publicUrl);
}

export async function saveDealImages(supabase: Supabase, images: File[], dealId: string) {
  const dealerId = await getUserId();
  const folder = `${dealerId}/${dealId}`;

  for (const image of images) {
    const filename = generateRandomFilename(image);
    await saveImage(supabase, image, BUCKET_DEAL_IMAGES, filename, folder);
  }
}

export async function deleteDealImages(superbase: Supabase, dealerId: string, dealId: string) {
  const path = `${dealerId}/${dealId}`;

  const { data, error } = await supabase.storage.from(BUCKET_DEAL_IMAGES).list(path);

  if (error) {
    console.log("Can't delete deal images:", error);
  }

  const filesToDelete = data?.map((fileObject) => `${path}/${fileObject.name}`) || [];
  await supabase.storage.from(BUCKET_DEAL_IMAGES).remove([...filesToDelete, path]);
}
