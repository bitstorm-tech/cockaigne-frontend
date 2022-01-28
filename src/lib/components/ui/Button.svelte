<script lang="ts">
  export let type = "";
  export let small = false;
  export let href = "";
</script>

{#if href}
  <a {href}>
    <button class="btn btn-outline" class:btn-sm={small} {type}>
      <slot />
    </button>
  </a>
{:else }
  <button class="btn btn-outline" class:btn-sm={small} {type} on:click>
    <slot />
  </button>
{/if}
