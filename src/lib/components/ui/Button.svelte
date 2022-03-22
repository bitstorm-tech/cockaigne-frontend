<script lang="ts">
  export let disabled = false;
  export let type = "";
  export let small = false;
  export let href = "";
  export let loading = false;
</script>

{#if href}
  <a {href}>
    <button class="btn btn-outline" class:loading class:btn-sm={small} {type} {disabled}>
      <slot />
    </button>
  </a>
{:else}
  <button class="btn btn-outline" class:loading class:btn-sm={small} {type} on:click {disabled}>
    <slot />
  </button>
{/if}
