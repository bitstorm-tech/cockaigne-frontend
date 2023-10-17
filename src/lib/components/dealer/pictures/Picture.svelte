<script lang="ts">
  import TrashIcon from "$lib/components/ui/icons/TrashIcon.svelte";
  import { createEventDispatcher } from "svelte";

  export let url: string;
  export let showDelete = false;
  export let fixedHeight = true;
  export let smallHeight = false;

  const dispatch = createEventDispatcher();
</script>

<button class="relative" on:click={() => dispatch("zoom")}>
  {#if showDelete}
    <button class="absolute cursor-pointer p-1 text-red-600" on:click|stopPropagation={() => dispatch("delete")}>
      <TrashIcon />
    </button>
  {/if}
  <img
    class:h-48={fixedHeight}
    class:h-36={smallHeight}
    class="w-full object-cover"
    src={url}
    alt="Dealer Impression" />
</button>
