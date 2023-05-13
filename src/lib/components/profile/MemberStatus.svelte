<script lang="ts">
  import { page } from "$app/stores";
</script>

{#if !$page.data.session.user.user_metadata.isDealer}
  <span class="badge badge-xs bg-primary p-2 text-xs text-[#dde3e4]">
    {#if $page.data.session}
      PRO
    {:else}
      BASIC
    {/if}
  </span>
{/if}
