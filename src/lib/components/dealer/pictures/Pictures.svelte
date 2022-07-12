<script lang="ts">
  import AddPictureButton from "$lib/components/dealer/pictures/AddPictureButton.svelte";
  import ConfirmDeletePictureModal from "$lib/components/dealer/pictures/ConfirmDeletePictureModal.svelte";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";

  export let pictures: string[] = [];
  let toastText = "";
  let openModal = false;
  let deletePictureUrl: string;

  async function savePicture(event: CustomEvent<File>) {
    toastText = "Speichere Bild ...";
    const formData = new FormData();
    formData.append("file", event.detail);

    const response = await fetch("/api/pictures", { method: "post", body: formData });
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
    await fetch(`/api/pictures/${filename}`, { method: "delete" });
    pictures = pictures.filter((pictureUrl) => pictureUrl !== deletePictureUrl);
    toastText = "";
  }

  function onDelete(url: string) {
    deletePictureUrl = url;
    openModal = true;
  }
</script>

<div class="flex flex-wrap">
  {#each pictures as picture}
    <Picture url={picture} on:delete={() => onDelete(picture)} />
  {/each}
</div>
<div class="sticky bottom-3 pr-3 w-full flex justify-end">
  <AddPictureButton on:select={savePicture} />
</div>
{#if toastText.length > 0}
  <div class="mx-3 sticky bottom-3">
    <Toast>{toastText}</Toast>
  </div>
{/if}
<ConfirmDeletePictureModal bind:open={openModal} url={deletePictureUrl} deleteFunction={deletePictureCallback} />
