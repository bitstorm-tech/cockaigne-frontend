<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
  export let category = "";
</script>

<div class=" h-52 flex-col">
  <div class="grid grid-cols-7">
    <div class="col-span-4 m-4 flex flex-col">
      <span class="text-xs text-[#6a828c]"><b>Kategorie</b></span>
      <span class="text-xs font-extralight italic text-[#6a828c]">{category}</span>
      <span class="mb-2 line-clamp-2 pt-8 text-xl">{name}</span>
      <span class="text-xs">{street}</span>
      <span class="text-xs">{city}</span>
    </div>
    <div class="col-span-3 -mt-6 mr-14 flex flex-col items-center gap-2">
      <ProfilePicture {imageUrl} />
      <div class="absolute right-0 top-20">
        <slot />
      </div>
    </div>
  </div>
</div>
