<script lang="ts">
  import { page } from "$app/stores";
  import RatingModal from "$lib/components/dealer/RatingModal.svelte";
  import RatingsListItem from "$lib/components/dealer/RatingsListItem.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ConfirmationModal from "$lib/components/ui/ConfirmationModal.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import { getAccount } from "$lib/supabase/account-service";
  import type { Rating, RatingUpdate } from "$lib/supabase/public-types";
  import { deleteRating, getRatings, saveRating } from "$lib/supabase/rating-service";
  import { onMount } from "svelte";

  export let dealerId: string;
  export let userId: string;
  export let isDealer = false;
  let ratings: Rating[] = [];
  let openModal = false;
  let openConfirmationModal = false;
  let loading = true;

  $: averageRating = calcAverageRating(ratings);
  $: showRatingButton = !isDealer && !ratings.some((rating) => rating.user_id === userId);

  onMount(async () => {
    ratings = await getRatings($page.data.supabase, dealerId);
    loading = false;
  });

  async function saveNewRating(event: CustomEvent) {
    const rating = event.detail;
    rating.dealer_id = dealerId;
    rating.user_id = userId;
    await saveRating($page.data.supabase, rating);
    const account = await getAccount($page.data.supabase, userId);
    rating.username = account?.username;
    rating.created = new Date();
    ratings = [rating, ...ratings];
  }

  function calcAverageRating(ratings: Rating[]): string {
    let sum = 0;
    let numberOfRatings = ratings.length;
    ratings.forEach((rating) => (sum += rating.stars || 0));

    return (sum / numberOfRatings).toFixed(1);
  }

  function updateAverageRating(event: CustomEvent<RatingUpdate>) {
    const updatedRating = event.detail;
    ratings = ratings.map((r) => (r.user_id === event.detail.user_id ? { ...r, stars: updatedRating.stars || 0 } : r));
  }

  function delRating() {
    deleteRating($page.data.supabase, userId, dealerId);
    ratings = ratings.filter((r) => r.user_id !== userId);
  }
</script>

{#if showRatingButton && userId}
  <div class="grid grid-cols-1 p-2">
    <Button on:click={() => (openModal = true)}>Schreibe eine Bewertung</Button>
  </div>
{/if}
<div class="flex flex-col gap-3">
  {#if loading}
    <span class="m-auto mt-10">
      <LoadingSpinner /> Lade Bewertungen ...
    </span>
  {/if}
  {#if !loading && ratings.length === 0}
    {#if isDealer}
      <EmptyContent>Leider hat dich noch niemand bewertet :(</EmptyContent>
    {:else}
      <EmptyContent>
        <p>Sei der erste der eine Bewertung schreibt!</p>
        <p>(nur für Pro-Mitglieder)</p>
      </EmptyContent>
    {/if}
  {:else}
    <span class="m-2">Durchschnitt: {averageRating}</span>
    {#each ratings as rating}
      <RatingsListItem {rating} on:update={updateAverageRating} on:delete={() => (openConfirmationModal = true)} />
    {/each}
  {/if}
</div>
<RatingModal bind:open={openModal} on:create-or-update={saveNewRating} />
<ConfirmationModal
  bind:open={openConfirmationModal}
  conformationCallback={delRating}
  text="Willst du deine Bewertung wirklich löschen?"
/>
