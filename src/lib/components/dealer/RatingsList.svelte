<script lang="ts">
  import { page } from "$app/stores";
  import RatingModal from "$lib/components/dealer/RatingModal.svelte";
  import RatingsListItem from "$lib/components/dealer/RatingsListItem.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import type { Rating } from "$lib/supabase/public-types";
  import { getRatings, saveRating } from "$lib/supabase/rating-service";

  export let showRatingButton = false;
  export let dealerId: string;
  export let userId: string;
  export let isDealer = false;
  let newRating: Rating;
  let openModal = false;

  async function fetchRatings() {
    const ratings = await getRatings($page.data.supabase, dealerId);

    showRatingButton = !isDealer && !ratings.some((rating) => rating.user_id === userId);

    return ratings;
  }

  async function saveNewRating(event: CustomEvent) {
    const rating = event.detail;
    rating.dealer_id = dealerId;
    rating.user_id = userId;
    await saveRating($page.data.supabase, rating);
    newRating = rating;
    showRatingButton = false;
  }

  function calcAverageRating(ratings: Rating[]): string {
    let sum = 0;
    let numberOfRatings = ratings.length;
    ratings.forEach((rating) => (sum += rating?.stars || 0));
    if (newRating) {
      sum += newRating.stars!!;
      numberOfRatings += 1;
    }

    return (sum / numberOfRatings).toFixed(1);
  }
</script>

{#if showRatingButton}
  <div class="grid grid-cols-1 p-2">
    <Button on:click={() => (openModal = true)}>Schreibe eine Bewertung</Button>
  </div>
{/if}
<div class="flex flex-col gap-3">
  {#await fetchRatings()}
    <span class="m-auto mt-10">
      <LoadingSpinner /> Lade Bewertungen ...
    </span>
  {:then ratings}
    {#if ratings.length === 0 && !newRating}
      {#if isDealer}
        <EmptyContent>Leider hat dich noch niemand bewertet :(</EmptyContent>
      {:else}
        <EmptyContent>Sei der erste der eine Bewertung schreibt!</EmptyContent>
      {/if}
    {:else}
      <span class="m-2">Durchschnitt: {calcAverageRating(ratings)}</span>
      {#if newRating}
        <RatingsListItem rating={newRating} />
      {/if}
      {#each ratings as rating}
        <RatingsListItem {rating} />
      {/each}
    {/if}
  {:catch}
    <EmptyContent>
      <p>Ups, da ist leider etwas schief gelaufen :(</p>
      <p>Bitte versuche es später nochmal</p>
    </EmptyContent>
  {/await}
</div>
<RatingModal bind:open={openModal} on:create={saveNewRating} />
