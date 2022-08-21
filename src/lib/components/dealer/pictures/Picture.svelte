<script lang="ts">
  import { page } from "$app/stores";
  import TrashIcon from "$lib/components/ui/icons/TrashIcon.svelte";
  import ZoomIcon from "$lib/components/ui/icons/ZoomIcon.svelte";
  import { createEventDispatcher } from "svelte";

  export let url: string;

  const dispatch = createEventDispatcher();
</script>

<div class="p-0.5 w-1/3 relative">
  {#if $page.data.user.isDealer}
    <div class="absolute p-1 text-red-600 cursor-pointer" on:click={() => dispatch("delete")}>
      <TrashIcon />
    </div>
  {:else}
    <div class="absolute p-1 text-red-600 cursor-pointer" on:click={() => dispatch("zoom")}>
      <ZoomIcon />
    </div>
  {/if}
  <img class="h-60 object-cover" src={url} alt="Dealer Impression" />
</div>
