<script lang="ts">
  import AddPictureButton from "$lib/components/dealer/pictures/AddPictureButton.svelte";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";

  export let pictures: string[] = [];
  let showToast = false;

  async function savePicture(event: CustomEvent<File>) {
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

  async function deletePicture(url: string) {
    alert("Delete picture:" + url);
  }
</script>

<div class="flex flex-wrap">
  {#each pictures as picture}
    <Picture url={picture} on:delete={() => deletePicture(picture)} />
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
