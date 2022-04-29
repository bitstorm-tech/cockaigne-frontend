<script>
  import DefaultProfile from "$lib/components/ui/icons/DefaultProfile.svelte";

  export let imageUrl = "";
</script>

<div class="avatar cursor-pointer">
  <div class="rounded-full ring-1 ring-primary ring-stone-600 ring-offset-1 w-full h-full">
    {#if imageUrl.length === 0}
      <DefaultProfile />
    {:else}
      <img src={imageUrl} alt="Profile" />
    {/if}
  </div>
</div>
