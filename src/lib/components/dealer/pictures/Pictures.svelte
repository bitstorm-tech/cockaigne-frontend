<script lang="ts">
  import { page } from "$app/stores";
  import AddPictureButton from "$lib/components/dealer/pictures/AddPictureButton.svelte";
  import ConfirmDeletePictureModal from "$lib/components/dealer/pictures/ConfirmDeletePictureModal.svelte";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import ZoomPictureModal from "$lib/components/dealer/pictures/ZoomPictureModal.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";
  import { deleteDealerImage, saveDealerImage } from "$lib/supabase/storage-service";

  export let pictures: string[] = [];
  export let companyName = "";

  let toastText: string | null;
  let openDeleteModal = false;
  let openZoomModal = false;
  let deletePictureUrl: string;
  let zoomImageIndex = 0;

  const supabase = $page.data.supabase;
  const userId = $page.data.userId;
  const isDealer = $page.data.isDealer;

  async function savePicture(event: CustomEvent<File>) {
    if (!userId) return;

    toastText = "Speichere Bild ...";
    const imageUrl = await saveDealerImage(supabase, userId, event.detail);

    if (imageUrl) {
      pictures = [...pictures, imageUrl];
    }

    toastText = null;
  }

  async function deletePictureCallback() {
    if (!userId) return;

    toastText = "Lösche Bild ...";
    const filename = deletePictureUrl.split("/").pop() || "";
    await deleteDealerImage(supabase, userId, filename);
    pictures = pictures.filter((pictureUrl) => pictureUrl !== deletePictureUrl);
    toastText = null;
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
    <Picture url={picture} showDelete={isDealer} on:delete={() => onDelete(picture)} on:zoom={() => onZoom(index)} />
  {/each}
</div>
{#if isDealer}
  <div class="sticky bottom-3 flex w-full justify-end pb-9 pr-3">
    <AddPictureButton on:select={savePicture} />
  </div>
{/if}
<Toast show={!!toastText}>{toastText}</Toast>
<ConfirmDeletePictureModal bind:open={openDeleteModal} url={deletePictureUrl} deleteFunction={deletePictureCallback} />
<ZoomPictureModal bind:open={openZoomModal} imageUrls={pictures} index={zoomImageIndex} title={companyName} />
