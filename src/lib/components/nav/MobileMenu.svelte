<script>
  import TagIcon from "$lib/components/ui/icons/TagIcon.svelte";
  import MapIcon from "$lib/components/ui/icons/MapIcon.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
  import LegalFooter from "$lib/components/nav/LegalFooter.svelte";
  import LogoutIcon from "$lib/components/ui/icons/LogoutIcon.svelte";
  import { session } from "$app/stores";
  import LoginIcon from "$lib/components/ui/icons/LoginIcon.svelte";
  import { goto } from "$app/navigation";

  async function logout() {
    await fetch("/api/logout");
    session.update((oldSession) => {
      return {
        ...oldSession,
        isAuthenticated: false
      };
    });
    await goto("/");
  }
</script>

<div class="flex flex-col gap-8 p-4 z-50 bg-base-300">
  {#if $session.isAuthenticated}
    <a href="/privacy" class="h-8 flex items-center gap-3"><TagIcon /> Schnäppchen</a>
    <a href="/map" class="h-8 flex items-center gap-3"><MapIcon /> Umgebungskarte</a>
    <a href="/test" class="h-8 flex items-center gap-3"><FireIcon /> Test</a>
    <a on:click={logout} class="h-8 flex items-center gap-3"><LogoutIcon /> Logout</a>
  {:else}
    <a href="/" class="h-8 flex items-center gap-3"><LoginIcon /> Login</a>
  {/if}
  <div class="mt-8">
    <LegalFooter />
  </div>
</div>
