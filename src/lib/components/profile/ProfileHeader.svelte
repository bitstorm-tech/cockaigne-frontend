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
    <div class="flex flex-col items-center gap-2 -mt-6 ">
      <div class="w-32 h-32 z-10">
        <ProfilePicture {imageUrl} />
      </div>
      <Button href={actionUrl} outline>
        <AddDocumentIcon />
      </Button>
    </div>
  </div>
</div>
