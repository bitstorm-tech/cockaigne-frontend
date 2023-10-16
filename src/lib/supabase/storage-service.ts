import { logError } from "$lib/error-utils";
import type { Supabase } from "$lib/supabase/supabase-client";
import { v4 as uuid } from "uuid";

const BUCKET_DEALER_IMAGES = "dealer-images";
const BUCKET_PROFILE_IMAGES = "profile-images";
const BUCKET_DEAL_IMAGES = "deal-images";

const DEFAULT_DEALER_PROFILE_IMAGE_URL = "/images/anonym-profile-dealer.svg";
const DEFAULT_USER_PROFILE_IMAGE_URL = "/images/anonym-profile-user.svg";

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

  if (error) {
    return logError(error, "Can't save image");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
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
    return logError(error, "Can't get deal images", []);
  }

  const filenames = data?.map((fileObject) => `${path}/${fileObject.name}`);
  return filenames.map((filename) => supabase.storage.from(BUCKET_DEAL_IMAGES).getPublicUrl(filename).data.publicUrl);
}

export async function saveDealImages(supabase: Supabase, userId: string, images: File[], dealId: string) {
  const folder = `${userId}/${dealId}`;

  for (const image of images) {
    const filename = generateRandomFilename(image);
    await saveImage(supabase, image, BUCKET_DEAL_IMAGES, filename, folder);
  }
}

export async function copyDealImages(supabase: Supabase, userId: string, templateId: string, dealId: string) {
  const templateFolder = `${userId}/${templateId}`;
  const dealFolder = `${userId}/${dealId}`;

  const filesResult = await supabase.storage.from(BUCKET_DEAL_IMAGES).list(templateFolder);

  if (filesResult.error) {
    return logError(filesResult.error, "Can't copy deal images from template");
  }

  const filenames = filesResult.data.map((fileObject) => fileObject.name);

  for (const filename of filenames) {
    const { error } = await supabase.storage
      .from(BUCKET_DEAL_IMAGES)
      .copy(`${templateFolder}/${filename}`, `${dealFolder}/${filename}`);
    if (error) {
      logError(error, "Can't copy deal images from template");
    }
  }
}

export async function deleteDealImages(supabase: Supabase, dealerId: string, dealId: string) {
  const path = `${dealerId}/${dealId}`;

  const { data, error } = await supabase.storage.from(BUCKET_DEAL_IMAGES).list(path);

  if (error) {
    return logError(error, "Can't delete deal images");
  }

  const filesToDelete = data.map((fileObject) => `${path}/${fileObject.name}`) || [];
  await supabase.storage.from(BUCKET_DEAL_IMAGES).remove([...filesToDelete, path]);
}

export async function deleteSpecificDealImages(
  supabase: Supabase,
  dealerId: string,
  dealId: string,
  filenames: string[]
) {
  const paths = filenames.map((filename: string) => `${dealerId}/${dealId}/${filename}`);
  const { error } = await supabase.storage.from(BUCKET_DEAL_IMAGES).remove(paths);

  if (error) {
    logError(error, "Can't delete specific deal image");
  }
}
