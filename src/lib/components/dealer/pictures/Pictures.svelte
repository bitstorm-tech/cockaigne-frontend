<script lang="ts">
  import { page } from "$app/stores";
  import AddPictureButton from "$lib/components/dealer/pictures/AddPictureButton.svelte";
  import ConfirmDeletePictureModal from "$lib/components/dealer/pictures/ConfirmDeletePictureModal.svelte";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import ZoomPictureModal from "$lib/components/dealer/pictures/ZoomPictureModal.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";

  export let pictures: string[] = [];
  export let companyName = "";

  let toastText = "";
  let openDeleteModal = false;
  let openZoomModal = false;
  let deletePictureUrl: string;
  let zoomImageIndex = 0;

  async function savePicture(event: CustomEvent<File>) {
    toastText = "Speichere Bild ...";
    const formData = new FormData();
    formData.append("file", event.detail);

    const response = await fetch("/api/images", { method: "post", body: formData });
    if (response.ok) {
      const picture = await response.text();
      pictures = [...pictures, picture];
    }
    toastText = "";
  }

  async function deletePictureCallback() {
    toastText = "Lösche Bild ...";
    const tokens = deletePictureUrl.split("/");
    const filename = tokens.pop();
    await fetch(`/api/images/${filename}`, { method: "delete" });
    pictures = pictures.filter((pictureUrl) => pictureUrl !== deletePictureUrl);
    toastText = "";
  }

  function onDelete(url: string) {
    deletePictureUrl = url;
    openDeleteModal = true;
  }

  function onZoom(index: number) {
    zoomImageIndex = index;
    openZoomModal = true;
  }
</script>

{#if pictures.length === 0}
  <EmptyContent>Füge ein paar Bilder hinzu und mach deine Seite noch schöner!</EmptyContent>
{/if}
<div class="grid grid-cols-3 gap-2">
  {#each pictures as picture, index}
    <Picture
      url={picture}
      showDelete={$page.data.user.isDealer}
      on:delete={() => onDelete(picture)}
      on:zoom={() => onZoom(index)}
    />
  {/each}
</div>
{#if $page.data.user.isDealer}
  <div class="sticky bottom-3 pr-3 pb-9 w-full flex justify-end">
    <AddPictureButton on:select={savePicture} />
  </div>
{/if}
{#if toastText.length > 0}
  <div class="mx-3 sticky bottom-3">
    <Toast>{toastText}</Toast>
  </div>
{/if}
<ConfirmDeletePictureModal bind:open={openDeleteModal} url={deletePictureUrl} deleteFunction={deletePictureCallback} />
<ZoomPictureModal bind:open={openZoomModal} imageUrls={pictures} index={zoomImageIndex} title={companyName} />
