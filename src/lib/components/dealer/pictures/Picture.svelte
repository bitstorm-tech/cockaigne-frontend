<script lang="ts">
  import TrashIcon from "$lib/components/ui/icons/TrashIcon.svelte";
  import { createEventDispatcher } from "svelte";

  export let url: string;
  export let showDelete = false;
  export let fixedHeight = true;
  export let smallHeight = false;

  const dispatch = createEventDispatcher();
</script>

<div class="relative" on:click={() => dispatch("zoom")}>
  {#if showDelete}
    <button class="absolute p-1 text-red-600 cursor-pointer" on:click|stopPropagation={() => dispatch("delete")}>
      <TrashIcon />
    </button>
  {/if}
  <img
    class:h-60={fixedHeight}
    class:h-36={smallHeight}
    class="object-cover"
    src={url}
    alt="Dealer Impression"
  />
</div>
