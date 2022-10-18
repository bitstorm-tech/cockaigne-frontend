<script lang="ts">
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";
</script>

{#key $page.url}
  <div class="absolute" in:fly={{ delay: 500 }} out:fly={{ delay: 500 }}>
    <slot />
  </div>
{/key}
