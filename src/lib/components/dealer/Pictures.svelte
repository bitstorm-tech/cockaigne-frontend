<script lang="ts">
  import AddPictureButton from "$lib/components/pictures/AddPictureButton.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";

  export let pictures: string[] = [];
  let showToast = false;

  export async function savePicture(event) {
    showToast = true;
    const formData = new FormData();
    formData.append("file", event.detail);

    const response = await fetch("/api/pictures", { method: "post", body: formData });
    if (response.ok) {
      const picture = await response.text();
      pictures = [...pictures, picture];
    }
    showToast = false;
  }
</script>

<div class="flex flex-wrap">
  {#each pictures as picture}
    <div class="p-0.5 w-1/3">
      <img class="h-60 object-cover" src={picture} alt="Dealer Impression" />
    </div>
  {/each}
</div>
<div class="sticky bottom-3 pr-3 w-full flex justify-end">
  <AddPictureButton on:select={savePicture} />
</div>
{#if showToast}
  <div class="mx-3 sticky bottom-3">
    <Toast>Speichere Bild ...</Toast>
  </div>
{/if}
