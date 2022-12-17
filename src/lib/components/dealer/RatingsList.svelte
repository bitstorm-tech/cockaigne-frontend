<script lang="ts">
  import RatingModal from "$lib/components/dealer/RatingModal.svelte";
  import RatingsListItem from "$lib/components/dealer/RatingsListItem.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import type { Rating } from "$lib/database/rating/rating.model";
  import { POST } from "$lib/http.utils";

  export let showRatingButton = false;
  export let dealerId: number;
  export let userId: number;
  export let isDealer = false;
  let newRating: Rating;
  let openModal = false;

  async function fetchRatings() {
    const result = await fetch("/api/ratings/" + dealerId);

    if (!result.ok) {
      throw result.statusText;
    }

    const ratings = await result.json();
    showRatingButton = !isDealer && !ratings.some((rating: Rating) => +rating.account_id === +userId);

    return ratings;
  }

  async function saveNewRating(event) {
    const rating = event.detail;
    rating.dealer_id = dealerId;
    const result = await fetch("/api/ratings", POST(rating));

    if (result.ok) {
      newRating = await result.json();
    }
  }

  function calcAverageRating(ratings: Rating[]): string {
    let sum = 0;
    ratings.forEach((rating) => (sum += rating?.stars || 0));
    console.log("sum, rating.length:", sum, ratings.length);
    return (sum / ratings.length).toFixed(1);
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
    {#if ratings.length === 0}
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
  {:catch error}
    <EmptyContent>
      <p>Ups, da ist leider etwas schief gelaufen :(</p>
      <p>Bitte versuche es später nochmal</p>
    </EmptyContent>
  {/await}
</div>
<RatingModal bind:open={openModal} on:create={saveNewRating} />
