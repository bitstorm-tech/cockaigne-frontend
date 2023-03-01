<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import type { Rating } from "$lib/supabase/public-types";
  import storageService from "$lib/supabase/storage-service";
  import { onMount } from "svelte";
  import LoadingSpinner from "../ui/icons/LoadingSpinner.svelte";

  export let rating: Rating;

  let imageUrl: string;
  let name: string;

  onMount(async () => {
    if (!rating.user_id) return;
    imageUrl = await storageService.getProfileImage(rating.user_id);
    name = rating.username || "Name";
  });
</script>

<div class="flex flex-col">
  <div class="flex items-center justify-between border-y border-base-300 bg-base-200 py-2 pl-20 pr-4">
    <div class="absolute left-4 pt-8">
      {#if !imageUrl}
        <LoadingSpinner />
      {:else}
        <ProfilePicture {imageUrl} size={3} />
      {/if}
    </div>
    <div>{name}</div>
    <RatingStars stars={rating.stars} showLabel={false} disabled={true} />
  </div>
  <div class="bg-base-100 p-2 pt-6 text-xs">
    {rating.rating_text}
  </div>
</div>
