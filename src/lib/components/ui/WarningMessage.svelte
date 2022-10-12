<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { createEventDispatcher } from "svelte";
  import WarningIcon from "./icons/WarningIcon.svelte";

  const dispatch = createEventDispatcher();

  export let show = false;

  function confirm() {
    show = false;
    dispatch("confirm");
  }
</script>

{#if show}
  <div class="toast toast-center toast-middle in:blur={{ duration: 500 }}">
    <div class="alert alert-error">
      <div class="flex">
        <WarningIcon size={6} />
        <p><slot /></p>
      </div>
      <Button on:click={confirm}>OK</Button>
    </div>
  </div>
{/if}
