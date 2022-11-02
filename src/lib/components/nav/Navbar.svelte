<script lang="ts">
  import MobileMenu from "$lib/components/nav/MobileMenu.svelte";
  import MemberStatus from "$lib/components/profile/MemberStatus.svelte";
  import CrossIcon from "$lib/components/ui/icons/CrossIcon.svelte";
  import MenuIcon from "$lib/components/ui/icons/MenuIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import { blur } from "svelte/transition";

  let showMobileMenu = false;

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

<nav class="flex py-2 px-4 md:px-52 items-center border-b-[0.01rem] border-[#556368]">
  <div class="flex justify-between items-center text-xl w-full">
    <div class="flex gap-6">
      <Link href="/"><img class="h-7" src="/images/logo.svg" alt="Logo Text" /></Link>
      <MemberStatus />
    </div>
    <div class="cursor-pointer text-[#69828c]">
      {#if showMobileMenu}
        <CrossIcon on:click={toggleMobileMenu} />
      {:else}
        <MenuIcon on:click={toggleMobileMenu} />
      {/if}
    </div>
  </div>
</nav>
{#if showMobileMenu}
  <div
    class="absolute z-50 w-screen border-b-[0.01rem] border-[#556368]"
    on:click={toggleMobileMenu}
    in:blur={{ duration: 250 }}
    out:blur={{ duration: 250 }}
  >
    <MobileMenu />
  </div>
{/if}
