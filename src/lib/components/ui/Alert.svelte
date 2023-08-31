<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { createEventDispatcher } from "svelte";
  import WarningIcon from "./icons/WarningIcon.svelte";

  const dispatch = createEventDispatcher();

  export let show = false;
  export let warning = true;

  function confirm() {
    show = false;
    dispatch("confirm");
  }
</script>

{#if show}
  <div class="transition:blur text- toast z-10 mb-14 w-full whitespace-normal">
    <div class="alert flex justify-between" class:alert-warning={warning}>
      <div class="flex items-center gap-3">
        <div>
          <WarningIcon size={2} />
        </div>
        <span><slot /></span>
      </div>
      <Button on:click={confirm} small {warning}>OK</Button>
    </div>
  </div>
{/if}
