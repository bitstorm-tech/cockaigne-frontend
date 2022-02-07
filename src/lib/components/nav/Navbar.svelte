<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import HamburgerIcon from "$lib/components/ui/icons/HamburgerIcon.svelte";
</script>

<nav class="flex justify-between py-2 px-4 md:px-52 items-center rounded-b-xl border-b-2 ">
  <div class="flex items-center text-xl gap-2">
    <div class="w-8 h-8">
      <HamburgerIcon />
    </div>
    <Link href="/" hoverUnderline>Hotspots</Link>
  </div>
  <div class="w-12 h-12">
    <ProfilePicture />
  </div>
</nav>
