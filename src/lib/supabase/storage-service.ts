import { getUserId, supabase } from "./supabase-client";

const BUCKET_DEALER_IMAGES = "dealer-images";
const BUCKET_PROFILE_IMAGES = "profile-images";

const DEFAULT_DEALER_PROFILE_IMAGE_URL = "/images/anonym-profile-dealer.png";
const DEFAULT_USER_PROFILE_IMAGE_URL = "/images/anonym-profile.png";

async function saveImage(file: File, bucket: string, filename: string, folder?: string): Promise<string | undefined> {
  const path = folder ? folder + "/" + filename : filename;

  const { error } = await supabase.storage.from(bucket).upload(path, file);

  if (!error) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  console.log("Can't save image:", error);
}

async function saveProfileImage(image: File): Promise<string | undefined> {
  const userId = await getUserId();

  if (!userId) {
    console.log("Can't save profile image -> unknown user");
    return;
  }

  const { data } = await supabase.storage.from(BUCKET_PROFILE_IMAGES).list(userId);

  if (data && data.length > 0) {
    await supabase.storage.from(BUCKET_PROFILE_IMAGES).remove(data.map((fileObject) => `${userId}/${fileObject.name}`));
  }

  const filename = Date.now() + "." + image.name.split(".").pop();

  return await saveImage(image, BUCKET_PROFILE_IMAGES, filename, userId);
}

async function saveDealerImage(image: File): Promise<string | undefined> {
  const id = await getUserId();
  const filename = new Date().getTime() + "." + image.name.split(".").pop();

  return await saveImage(image, BUCKET_DEALER_IMAGES, filename, id);
}

async function deleteDealerImage(filename: string) {
  const id = await getUserId();
  await supabase.storage.from(BUCKET_DEALER_IMAGES).remove([id + "/" + filename]);
}

async function getAllDealerImageUrls(dealerId: string): Promise<string[]> {
  const { data } = await supabase.storage.from(BUCKET_DEALER_IMAGES).list(dealerId);

  if (data) {
    return data.map(
      (fileObject) =>
        supabase.storage.from(BUCKET_DEALER_IMAGES).getPublicUrl(dealerId + "/" + fileObject.name).data.publicUrl
    );
  }

  return [];
}

async function getProfileImage(id?: string, isDealer = false): Promise<string> {
  const userId = id ? id : await getUserId();

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

export default {
  saveDealerImage,
  deleteDealerImage,
  getAllDealerImageUrls,
  getProfileImage,
  saveProfileImage
};
