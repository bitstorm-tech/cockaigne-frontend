<script>
  import DefaultProfile from '../icons/DefaultProfile.svelte';
  export let defaultPicture = false;
</script>

<div class="avatar cursor-pointer">
  <div class="rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
    {#if defaultPicture}
      <DefaultProfile />
    {:else}
      <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" alt="Profile Picutre" />
    {/if}
  </div>
</div>
