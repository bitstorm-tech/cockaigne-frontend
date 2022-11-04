<script>
  import LegalFooter from "$lib/components/nav/LegalFooter.svelte";
  import LogoutIcon from "$lib/components/ui/icons/LogoutIcon.svelte";
  import LoginIcon from "$lib/components/ui/icons/LoginIcon.svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";

  async function logout() {
    await fetch("/api/logout");
    await goto("/login");
    await invalidateAll();
  }
</script>

<div class="flex flex-col gap-8 p-4 z-50 bg-base-300">
  {#if $page.data.user.isAuthenticated}
    <a href="/settings" class="h-8 flex items-center gap-3"><GearIcon /> Einstellungen</a>
    <div on:click={logout} class="h-8 flex items-center gap-3 cursor-pointer"><LogoutIcon /> Logout</div>
  {:else}
    <a href="/" class="h-8 flex items-center gap-3"><LoginIcon /> Login</a>
  {/if}
  <div class="mt-8">
    <LegalFooter />
  </div>
</div>
