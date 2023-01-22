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
  <div class="transition:blur toast z-10 mb-14 w-screen">
    <div class="alert" class:alert-warning={warning}>
      <div class="flex w-full">
        <div>
          <WarningIcon size={2} />
        </div>
        <p><slot /></p>
      </div>
      <Button on:click={confirm} small {warning}>OK</Button>
    </div>
  </div>
{/if}
