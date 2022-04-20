<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import AddDocumentIcon from "$lib/components/ui/icons/AddDocumentIcon.svelte";

  export let name = "";
  export let street = "";
  export let city = "";
  export let imageUrl = "";
  export let actionUrl = "";
</script>

<div class="flex flex-col">
  <div class="flex justify-around">
    <div class="flex flex-col pt-2">
      <span class="text-2xl">{name}</span>
      <span>{street}</span>
      <span>{city}</span>
    </div>
    <div class="-mt-6 w-32 h-32 z-10">
      <ProfilePicture {imageUrl} />
    </div>
  </div>
  <div class="flex flex-row-reverse w-full pr-16 py-4">
    <Button href={actionUrl}>
      <div class="h-7">
        <AddDocumentIcon />
      </div>
    </Button>
  </div>
</div>
