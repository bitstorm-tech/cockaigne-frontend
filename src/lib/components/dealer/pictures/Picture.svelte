<script lang="ts">
  import TrashIcon from "$lib/components/ui/icons/TrashIcon.svelte";
  import { createEventDispatcher } from "svelte";

  export let url: string;

  const dispatch = createEventDispatcher();
</script>

<div class="p-0.5 w-1/3 relative">
  <div class="absolute top-1 left-1 text-red-600 cursor-pointer" on:click={() => dispatch("delete")}>
    <TrashIcon />
  </div>
  <img class="h-60 object-cover" src={url} alt="Dealer Impression" />
</div>
