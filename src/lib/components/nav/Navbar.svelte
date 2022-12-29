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

<nav class="flex px-4 py-2 md:px-52 items-center border-b-[0.01rem] border-[#556368]">
  <div class="flex justify-between text-xl w-full">
    <div class="flex gap-6 items-end">
      <Link href="/"><img class="h-10" src="/images/logo.svg" alt="Logo Text" /></Link>
      <MemberStatus />
    </div>
    <div class="flex cursor-pointer text-[#69828c]">
      {#if showMobileMenu}
        <button on:click={toggleMobileMenu}>
          <CrossIcon size={2.5} />
        </button>
      {:else}
        <button on:click={toggleMobileMenu}>
          <MenuIcon size={2.5} />
        </button>
      {/if}
    </div>
  </div>
</nav>
{#if showMobileMenu}
  <div
    class="absolute z-50 w-screen border-b-[0.01rem] border-[#556368]"
    on:click={toggleMobileMenu}
    on:keypress={toggleMobileMenu}
    transition:blur={{ duration: 200 }}
  >
    <MobileMenu />
  </div>
{/if}
