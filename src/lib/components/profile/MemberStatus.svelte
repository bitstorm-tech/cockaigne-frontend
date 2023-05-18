<script lang="ts">
  import { page } from "$app/stores";
</script>

{#if !$page.data.isDealer}
  <span class="badge badge-xs bg-primary p-2 text-xs text-[#dde3e4]">
    {#if $page.data.userId}
      PRO
    {:else}
      BASIC
    {/if}
  </span>
{/if}
