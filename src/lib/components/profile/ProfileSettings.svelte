<script>
  import HamburgerIcon from '$lib/components/icons/HamburgerIcon.svelte';
  import ProfilePicture from './ProfilePicture.svelte';
</script>

<div class="flex flex-col">
  <div class="flex w-screen h-14 bg-stone-200 rounded-b-lg py-2 px-6 items-center">
    <HamburgerIcon />
  </div>
  <span class="m-6 text-2xl">Max Müller</span>
</div>
<div class="absolute right-6 top-6">
  <ProfilePicture />
</div>
