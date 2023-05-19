<script lang="ts">
  import MobileMenu from "$lib/components/nav/MobileMenu.svelte";
  import MemberStatus from "$lib/components/profile/MemberStatus.svelte";
  import CrossIcon from "$lib/components/ui/icons/CrossIcon.svelte";
  import MenuIcon from "$lib/components/ui/icons/MenuIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import { menuOpen } from "$lib/stores/navigation.store";

  let showMobileMenu = false;

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
    menuOpen.set(showMobileMenu);
  }
</script>

<nav class="flex items-center border-b-[0.01rem] border-[#556368] px-4 py-2 md:px-52">
  <div class="flex w-full justify-between text-xl">
    <div class="flex items-end gap-6">
      <Link href="/"><img loading="lazy" class="h-7" src="/images/logo.svg" alt="Logo Text" /></Link>
      <!--MemberStatus /-->
    </div>
    <div class="flex cursor-pointer text-[#69828c]">
      {#if showMobileMenu}
        <button on:click|stopPropagation|preventDefault={toggleMobileMenu}>
          <CrossIcon size={1.85} />
        </button>
      {:else}
        <button on:click|stopPropagation|preventDefault={toggleMobileMenu}>
          <MenuIcon size={1.85} />
        </button>
      {/if}
    </div>
  </div>
</nav>
<div class="absolute z-50 w-screen border-b-[0.01rem] border-[#556368]">
  <MobileMenu bind:show={showMobileMenu} />
</div>
