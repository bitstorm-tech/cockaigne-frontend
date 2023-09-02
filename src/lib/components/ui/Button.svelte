<script lang="ts">
  export let disabled = false;
  export let small = false;
  export let loading = false;
  export let circle = false;
  export let error = false;
  export let warning = false;
  export let fullwidth = false;
  export let rightFlat = false;
  export let additionalWidth = false;
</script>

<button
  class="btn"
  class:w-24={additionalWidth}
  class:w-full={fullwidth}
  class:btn-primary={!warning}
  class:btn-warning={warning}
  class:text-gray-200={warning}
  class:btn-sm={small}
  class:btn-circle={circle}
  class:btn-error={error}
  class:rounded-r-none={rightFlat}
  {disabled}
  on:click
>
  {#if loading}
    <span class="loading loading-spinner"></span>
  {/if}
  <slot />
</button>
