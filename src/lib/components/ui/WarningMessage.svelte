<script lang="ts">
  import WarningIcon from "./icons/WarningIcon.svelte";
  import { blur } from "svelte/transition";

  export let show = false;
</script>

{#if show}
  <div class="flex border border-primary p-4 space-x-4" in:blur={{ duration: 500 }}>
    <WarningIcon size={6} />
    <span><slot /> </span>
  </div>
{/if}
