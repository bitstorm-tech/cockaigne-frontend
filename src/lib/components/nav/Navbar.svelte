<script lang="ts">
  import MobileMenu from "$lib/components/nav/MobileMenu.svelte";
  import CrossIcon from "$lib/components/ui/icons/CrossIcon.svelte";
  import HamburgerIcon from "$lib/components/ui/icons/HamburgerIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";

  let showMobileMenu = false;

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<nav class="flex justify-between bg-base-300 py-2 px-4 md:px-52 items-center">
  <div class="flex items-center text-xl gap-2">
    <div class="cursor-pointer">
      {#if showMobileMenu}
        <CrossIcon on:click={toggleMobileMenu} />
      {:else}
        <HamburgerIcon on:click={toggleMobileMenu} />
      {/if}
    </div>
    <Link href="/"><img class="h-7" src="/images/logo.svg" alt="Logo Text" /></Link>
  </div>
</nav>
{#if showMobileMenu}
  <div class="absolute z-50 w-screen" on:click={toggleMobileMenu}>
    <MobileMenu />
  </div>
{/if}
