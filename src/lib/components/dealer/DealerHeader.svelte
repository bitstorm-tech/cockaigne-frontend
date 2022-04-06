<script>
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import AddDocumentIcon from "$lib/components/ui/icons/AddDocumentIcon.svelte";
  import { goto } from "$app/navigation";
</script>

<div class="flex flex-col">
  <div class="flex justify-around">
    <div class="flex flex-col pt-2">
      <span class="text-2xl">Aakenus Grill</span>
      <span>Bahnhofstr. 22</span>
      <span>10123 Berlin</span>
    </div>
    <div class="-mt-6 w-32 h-32 z-10">
      <ProfilePicture imageUrl="/images/dummy/aakenus-grill-profile.svg" />
    </div>
  </div>
  <div class="flex flex-row-reverse w-full pr-16 py-4">
    <Button on:click={() => goto("/create-deal")}>
      <div class="h-7">
        <AddDocumentIcon />
      </div>
    </Button>
  </div>
</div>
