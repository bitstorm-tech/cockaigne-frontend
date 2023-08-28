<script lang="ts">
  import ProfilePicture from '$lib/components/profile/ProfilePicture.svelte';
  import NavigatorIcon from '$lib/components/ui/icons/NavigatorIcon.svelte';
  import PhoneIcon from '$lib/components/ui/icons/PhoneIcon.svelte';

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
  export let phone = "";
  export let category = ""
</script>

<div class="flex h-48 flex-col">
  <div class="flex justify-around">
    <div class="flex flex-col pt-2">
      <span class="text-xs text-[#6a828c]"><b>Kategorie</b></span>
      <span class="text-xs italic text-[#6a828c] font-extralight">{category}</span>
      <span class="pb-2 pt-8 text-2xl">{name}</span>
      <span>{street}</span>
      <span>{city}</span>
    </div>
    <div class="-mt-6 mr-8 flex flex-col items-center gap-2">
      <ProfilePicture {imageUrl} />
      <div class="absolute right-0 top-36">
        <div class="flex gap-4 items-center">
          <div class="flex flex-col">
            <a href={`tel:${phone}`}><button><PhoneIcon size={2} /></button></a>
            <button><NavigatorIcon size={2} /></button>
          </div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>
