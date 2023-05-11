<script>
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import LegalFooter from "$lib/components/nav/LegalFooter.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import LoginIcon from "$lib/components/ui/icons/LoginIcon.svelte";
  import LogoutIcon from "$lib/components/ui/icons/LogoutIcon.svelte";
  import NewsIcon from "$lib/components/ui/icons/NewsIcon.svelte";

  async function logout() {
    await $page.data.supabase.auth.signOut();
    await goto("/login");
    await invalidateAll();
  }
</script>

<div class="z-50 flex flex-col gap-8 bg-base-300 p-4 backdrop-blur">
  {#if $page.data.session?.user}
    <a href="/settings" class="flex h-8 items-center gap-3">
      <GearIcon />
      Einstellungen
    </a>
    <a href="/changelog" class="flex h-8 items-center gap-3">
      <NewsIcon />
      Was gibt es Neues?
    </a>
    <button on:click={logout} class="flex h-8 cursor-pointer items-center gap-3">
      <LogoutIcon />
      Logout
    </button>
  {:else}
    <a href="/" class="flex h-8 items-center gap-3">
      <LoginIcon />
      Login
    </a>
  {/if}
  <div class="mt-8">
    <LegalFooter />
  </div>
</div>
