<script lang="ts">
  import { page } from "$app/stores";
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import NavigatorIcon from "$lib/components/ui/icons/NavigatorIcon.svelte";
  import PhoneIcon from "$lib/components/ui/icons/PhoneIcon.svelte";

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
  export let phone = "";
  export let category = "";

  const googleLink = `https://maps.google.com/?q=${street},${city}`;
</script>

<div class="flex flex-col">
  <div class="grid grid-cols-7">
    <div class="col-span-4 m-4 flex flex-col pt-2">
      <span class="text-xs text-[#6a828c]"><b>Kategorie</b></span>
      <span class="text-xs font-extralight italic text-[#6a828c]">{category}</span>
      <span class="mb-2 line-clamp-2 pt-8 text-xl">{name}</span>
      <span class="text-xs">{street}</span>
      <span class="text-xs">{city}</span>
    </div>
    <div class="col-span-3 -mt-6 mr-14 flex flex-col items-center gap-2">
      <ProfilePicture {imageUrl} />
      <div class="absolute right-0 top-36">
        <div class="flex items-center gap-12">
          {#if !$page.data.isDealer}
            <div class="flex flex-col">
              <a target="_blank" href={`tel:${phone}`}><button><PhoneIcon size={2} /></button></a>
              <a target="_blank" href={googleLink}><button><NavigatorIcon size={2} /></button></a>
            </div>
          {/if}
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>
