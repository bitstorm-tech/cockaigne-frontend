<script lang="ts">
  export let disabled = false;
  export let type = "";
  export let small = false;
  export let loading = false;
  export let outline = false;
  export let circle = false;
  export let error = false;
</script>

<button
  class="btn"
  class:loading
  class:btn-outline={outline}
  class:btn-sm={small}
  class:btn-circle={circle}
  class:btn-error={error}
  {type}
  {disabled}
  on:click
>
  {#if !loading}<slot />{/if}
</button>
