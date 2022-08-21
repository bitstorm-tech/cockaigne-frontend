<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import LocationIcon from "$lib/components/ui/icons/LocationIcon.svelte";

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
</script>

<div class="flex justify-around">
  <div class="flex justify-around">
    <div class="flex flex-col pt-2 gap-2">
      <span class="text-2xl">{name}</span>
      <span class="text-sm"><b>Dein Standort</b> <a href="/map">(ändern)</a></span>
      <span class="flex gap-2"><LocationIcon size="1" /><i class="text-xs">{street}, {city}</i></span>
    </div>
    <div class="flex flex-col items-center gap-2 -mt-6 ">
      <div class="w-20 h-20 z-10">
        <ProfilePicture {imageUrl} />
      </div>
    </div>
  </div>
</div>
