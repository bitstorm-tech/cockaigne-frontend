<script>
  import DefaultProfile from "$lib/components/ui/icons/DefaultProfile.svelte";

  export let defaultPicture = false;
  export let imageUrl = "http://daisyui.com/tailwind-css-component-profile-1@94w.png";
</script>

<div class="avatar cursor-pointer z-50 w-28">
  <div class="rounded-full ring ring-primary ring-stone-600 ring-offset-1">
    {#if defaultPicture}
      <DefaultProfile />
    {:else}
      <img src={imageUrl} alt="Profile" />
    {/if}
  </div>
</div>
