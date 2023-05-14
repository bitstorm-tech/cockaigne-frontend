<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
</script>

<div class="flex flex-col">
  <div class="flex justify-around">
    <div class="flex flex-col pt-2">
      <span class="text-2xl">{name}</span>
      <span>{street}</span>
      <span>{city}</span>
    </div>
    <div class="-mt-6 mr-8 flex flex-col items-center">
      <ProfilePicture {imageUrl} />
      <slot />
    </div>
  </div>
</div>
