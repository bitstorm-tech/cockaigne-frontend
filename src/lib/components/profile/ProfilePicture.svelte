<script>
  import DefaultProfile from "../ui/icons/DefaultProfile.svelte";

  export let defaultPicture = false;
</script>

<div class="avatar cursor-pointer">
  <div class="mask mask-squircle">
    {#if defaultPicture}
      <DefaultProfile />
    {:else}
      <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" alt="Profile Picutre" />
    {/if}
  </div>
</div>
