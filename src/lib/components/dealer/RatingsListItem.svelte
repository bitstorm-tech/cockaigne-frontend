<script lang="ts">
  import { page } from "$app/stores";
  import RatingModal from "$lib/components/dealer/RatingModal.svelte";
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import EditIcon from "$lib/components/ui/icons/EditIcon.svelte";
  import TrashIcon from "$lib/components/ui/icons/TrashIcon.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import type { Rating } from "$lib/supabase/public-types";
  import { updateRating } from "$lib/supabase/rating-service";
  import { getProfileImage } from "$lib/supabase/storage-service";
  import { format } from "date-fns";
  import { createEventDispatcher, onMount } from "svelte";
  import LoadingSpinner from "../ui/icons/LoadingSpinner.svelte";

  export let rating: Rating;

  let imageUrl: string;
  let name: string;
  let created: string;
  let openModal = false;

  const dispatch = createEventDispatcher();
  const supabase = $page.data.supabase;

  onMount(async () => {
    if (rating.user_id) {
      imageUrl = await getProfileImage(supabase, rating.user_id);
    }
    name = rating.username || "Name";
    created = format(new Date(rating.created || ""), "dd.MM.yyyy");
  });

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
  <div class="flex items-center justify-between border-y border-base-300 bg-base-200 py-2 pl-20 pr-4">
    <div class="absolute left-4 pt-8">
      {#if !imageUrl}
        <LoadingSpinner />
      {:else}
        <ProfilePicture {imageUrl} size={3} />
      {/if}
    </div>
    <div class="flex gap-2">
      <div>{name} am {created}</div>
      {#if rating.user_id === $page.data.userId}
        <button on:click={() => (openModal = true)}><EditIcon size={1.2} /></button>
        <button on:click={() => dispatch("delete", rating.user_id)}><TrashIcon size={1.2} /></button>
      {/if}
    </div>
    <RatingStars stars={rating.stars} showLabel={false} disabled={true} />
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
  on:create-or-update={update}
/>
