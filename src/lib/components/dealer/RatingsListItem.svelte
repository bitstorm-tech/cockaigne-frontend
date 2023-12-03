<script lang="ts">
  import { page } from "$app/stores";
  import RatingModal from "$lib/components/dealer/RatingModal.svelte";
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import EditIcon from "$lib/components/ui/icons/EditIcon.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import type { Rating } from "$lib/supabase/public-types";
  import { updateRating } from "$lib/supabase/rating-service";
  import { getProfileImage } from "$lib/supabase/storage-service";
  import { format } from "date-fns";
  import { createEventDispatcher } from "svelte";
  import LoadingSpinner from "../ui/icons/LoadingSpinner.svelte";

  export let rating: Rating;

  let openModal = false;

  const dispatch = createEventDispatcher();
  const supabase = $page.data.supabase;

  const created = format(new Date(rating.created || Date.now()), "dd.MM.yyyy");

  async function update(event: CustomEvent) {
    const ratingUpdate = event.detail;
    ratingUpdate.user_id = $page.data.userId;
    await updateRating($page.data.supabase, ratingUpdate);
    rating.rating_text = ratingUpdate.rating_text;
    rating.stars = ratingUpdate.stars;
    dispatch("update", ratingUpdate);
  }
</script>

<div class="flex flex-col">
  <div class="flex items-center justify-between border-y border-base-300 bg-[#232b2e] py-2 pl-24 pr-4">
    <div class="absolute left-4 pt-8">
      {#await getProfileImage(supabase, rating.user_id)}
        <LoadingSpinner />
      {:then imageUrl}
        <ProfilePicture {imageUrl} size={3.5} />
      {/await}
    </div>
    <div class="flex gap-2 text-sm">
      <div class="flex flex-col">
        <span>{rating.username}</span>
        <span class="text-xs">{created}</span>
      </div>
    </div>
    {#if rating.user_id === $page.data.userId}
      <button on:click={() => (openModal = true)}>
        <EditIcon size={1.2} />
      </button>
    {/if}
    <RatingStars stars={rating.stars || 3} showLabel={false} disabled={true} />
  </div>
  <div class="bg-base-100 p-2 pt-6 text-sm">
    {rating.rating_text}
  </div>
</div>
<RatingModal
  update={true}
  bind:open={openModal}
  ratingText={rating.rating_text || ""}
  stars={rating.stars || 5}
  allowDelete={rating.user_id === $page.data.userId}
  on:create-or-update={update}
  on:delete={() => dispatch("delete", rating.user_id)} />
