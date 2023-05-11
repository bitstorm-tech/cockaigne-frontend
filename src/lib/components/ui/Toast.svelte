<script>
  export let show = false;
  $: show && setTimeout(() => (show = false), 2500);
</script>

{#if show}
  <div class="toast-center toast-bottom toast mb-16 w-screen">
    <div class="alert alert-success">
      <span><slot /></span>
    </div>
  </div>
{/if}
