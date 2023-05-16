<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import type { NominatimSearchResult, Position } from "$lib/geo/geo.types";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let disabled = false;
  export let searchText = "";
  let searchResults: NominatimSearchResult[] = [];

  const dispatch = createEventDispatcher();

  onMount(() => document.addEventListener("click", closeSearchResult));
  onDestroy(() => document.removeEventListener("click", closeSearchResult));

  async function search() {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`;
    const response = await fetch(url);
    if (response.ok) {
      const addresses = await response.json();
      if (addresses.length === 0) {
        return;
      }

      if (addresses.length === 1) {
        selectSearchResult(addresses[0]);
        return;
      }

      searchResults = addresses;
    }
  }

  function closeSearchResult() {
    searchResults = [];
  }

  function selectSearchResult(searchResult: NominatimSearchResult) {
    const location: Position = {
      latitude: searchResult.lat,
      longitude: searchResult.lon
    };

    searchText = searchResult.display_name;
    dispatch("addressSelected", { location, address: searchResult.display_name });
  }
</script>

<div class="flex flex-col gap-2">
  <Textarea label="Adresse" bind:value={searchText} {disabled} resize={false} lines={2} />
  <ul
    class="dropdown-content textarea-bordered textarea absolute z-10 mr-8 mt-8 max-h-[70%] overflow-auto bg-primary p-4"
    class:invisible={searchResults.length < 2}
  >
    {#each searchResults as result, index}
      <li class="cursor-pointer hover:bg-base-100">
        <button on:click={() => selectSearchResult(result)}>
          {result.display_name}
        </button>
      </li>
      {#if index < searchResults.length - 1}
        <div class="divider" />
      {/if}
    {/each}
  </ul>
  <Button on:click={search} {disabled}>Suchen</Button>
</div>
