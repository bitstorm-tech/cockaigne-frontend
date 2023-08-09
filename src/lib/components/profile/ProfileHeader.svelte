<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import PhoneIcon from "$lib/components/ui/icons/PhoneIcon.svelte";

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
  export let phone = "";
</script>

<div class="flex h-48 flex-col">
  <div class="flex justify-around">
    <div class="flex flex-col pt-2">
      <span class="bold text-xs"><b>Kategorie</b></span>
      <span>Foobar</span>
      <span class="py-4 text-2xl">{name}</span>
      <span>{street}</span>
      <span>{city}</span>
      <span class="mt-2 flex items-center gap-2"><PhoneIcon size={1} /> {phone}</span>
    </div>
    <div class="-mt-6 mr-8 flex flex-col items-center gap-2">
      <ProfilePicture {imageUrl} />
      <slot />
    </div>
  </div>
</div>
