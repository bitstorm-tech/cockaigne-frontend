<script>
  import TagIcon from "$lib/components/ui/icons/TagIcon.svelte";
  import MapIcon from "$lib/components/ui/icons/MapIcon.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import LegalFooter from "$lib/components/nav/LegalFooter.svelte";
  import LogoutIcon from "$lib/components/ui/icons/LogoutIcon.svelte";
  import LoginIcon from "$lib/components/ui/icons/LoginIcon.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  async function logout() {
    await fetch("/api/logout");
    goto("/").then();
  }
</script>

<div class="flex flex-col gap-8 p-4 z-50 bg-base-300">
  {#if $page.data.user.isAuthenticated}
    <a href="/privacy" class="h-8 flex items-center gap-3"><TagIcon /> Schnäppchen</a>
    <a href="/map" class="h-8 flex items-center gap-3"><MapIcon /> Umgebungskarte</a>
    <a href="/test" class="h-8 flex items-center gap-3"><FireIcon /> Test</a>
    <div on:click={logout} class="h-8 flex items-center gap-3 cursor-pointer"><LogoutIcon /> Logout</div>
  {:else}
    <a href="/" class="h-8 flex items-center gap-3"><LoginIcon /> Login</a>
  {/if}
  <div class="mt-8">
    <LegalFooter />
  </div>
</div>
