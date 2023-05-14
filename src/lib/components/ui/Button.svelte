<script lang="ts">
  export let disabled = false;
  export let small = false;
  export let loading = false;
  export let circle = false;
  export let error = false;
  export let warning = false;
  export let fullwidth = false;
</script>

<button
  class="btn"
  class:loading
  class:w-full={fullwidth}
  class:btn-primary={!warning}
  class:btn-warning={warning}
  class:text-gray-200={warning}
  class:btn-sm={small}
  class:btn-circle={circle}
  class:btn-error={error}
  {disabled}
  on:click
>
  {#if !loading}
    <slot />
  {/if}
</button>
