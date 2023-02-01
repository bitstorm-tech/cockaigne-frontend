<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";

  export let file: File;
  export let imagePreview: string;
  export let buttonText = "Bild auswählen";
  const dispatch = createEventDispatcher();
  let fileInput: HTMLInputElement;

  function pictureSelected(event) {
    file = event.target.files[0] as File;

    if (!file) {
      return;
    }

    const URL = window.URL || window.webkitURL;
    imagePreview = URL.createObjectURL(file);
    dispatch("fileSelected", file);
  }
</script>

<Button on:click={() => fileInput.click()}>{buttonText}</Button>
<input bind:this={fileInput} on:change={pictureSelected} type="file" hidden />
{#if imagePreview}
  <img loading="lazy" src={imagePreview} alt="Gewähltes Bild" class="w-screen md:w-2/3 self-center" />
{/if}
