<script lang="ts">
  import MobileMenu from "$lib/components/nav/MobileMenu.svelte";
  import MemberStatus from "$lib/components/profile/MemberStatus.svelte";
  import CrossIcon from "$lib/components/ui/icons/CrossIcon.svelte";
  import MenuIcon from "$lib/components/ui/icons/MenuIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";

  let showMobileMenu = false;

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<nav class="flex bg-base-300 py-2 px-4 md:px-52 items-center border-b-[0.01rem] border-[#556368]">
  <div class="flex justify-between items-center text-xl w-full">
    <div class="flex gap-6">
      <Link href="/"><img class="h-7" src="/images/logo.svg" alt="Logo Text" /></Link>
      <MemberStatus />
    </div>
    <div class="cursor-pointer">
      {#if showMobileMenu}
        <CrossIcon on:click={toggleMobileMenu} />
      {:else}
        <MenuIcon on:click={toggleMobileMenu} />
      {/if}
    </div>
  </div>
</nav>
{#if showMobileMenu}
  <div class="absolute z-50 w-screen" on:click={toggleMobileMenu}>
    <MobileMenu />
  </div>
{/if}
