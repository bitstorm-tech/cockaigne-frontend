<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import { onMount } from "svelte";
  import type { Rating } from "../../database/rating/rating.model";
  import LoadingSpinner from "../ui/icons/LoadingSpinner.svelte";

  export let rating: Rating;

  let imageUrl = "";
  let name = "Name";

  onMount(async () => {
    const response = await fetch(`/api/accounts/${rating.user_id}/profile-image-name`);

    if (response.ok) {
      const body = await response.json();
      imageUrl = body.profileImageUrl.replaceAll('"', "");
      name = body.name;
    }
  });
</script>

<div class="flex flex-col">
  <div class="flex justify-between items-center bg-base-200 py-2 border-y border-base-300 pl-20 pr-4">
    <div class="absolute left-4 pt-8">
      {#if imageUrl.length === 0}
        <LoadingSpinner />
      {:else}
        <ProfilePicture {imageUrl} size={3} />
      {/if}
    </div>
    <div>{name}</div>
    <RatingStars stars={rating.stars} showLabel={false} disabled={true} />
  </div>
  <div class="p-2 bg-base-100 text-xs pt-6">
    {rating.rating_text}
  </div>
</div>
