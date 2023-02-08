<script>
  import LoadingSpinner from "./icons/LoadingSpinner.svelte";
  export let show = false;
</script>

{#if show}
  <div class="toast toast-center toast-bottom mb-16 w-screen">
    <div class="alert">
      <span><LoadingSpinner /><slot /></span>
    </div>
  </div>
{/if}
