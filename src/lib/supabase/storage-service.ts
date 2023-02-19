import { getUserId, supabase } from "./supabase-client";

const BUCKET_DEALER_IMAGES = "dealer-images";
const BUCKET_PROFILE_IMAGES = "profile-images";

async function saveDealerImage(image: File): Promise<string | undefined> {
  const id = await getUserId();
  const filename = new Date().getTime() + "." + image.name.split(".").pop();

  const { error } = await supabase.storage.from(BUCKET_DEALER_IMAGES).upload(id + "/" + filename, image);

  if (!error) {
    const { data } = supabase.storage.from(BUCKET_DEALER_IMAGES).getPublicUrl(id + "/" + filename);
    return data.publicUrl;
  }
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

async function getProfileImage(id: string, isDealer = false): Promise<string> {
  const { data } = await supabase.storage.from(BUCKET_PROFILE_IMAGES).list(undefined, { search: id });
  const filename = data?.pop()?.name;

  if (filename) {
    return supabase.storage.from(BUCKET_PROFILE_IMAGES).getPublicUrl(filename).data.publicUrl;
  }

  return isDealer ? "/images/anonym-profile-dealer.png" : "/images/anonym-profile.png";
}

export default {
  saveDealerImage,
  deleteDealerImage,
  getAllDealerImageUrls,
  getProfileImage
};
