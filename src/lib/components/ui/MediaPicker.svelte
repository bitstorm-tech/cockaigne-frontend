<script lang="ts">
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let fileInput;
  let imagePreview;

  function pictureSelected(event) {
    const file = event.srcElement.files[0];

    if (!file) {
      return;
    }

    const URL = window.URL || window.webkitURL;
    imagePreview = URL.createObjectURL(file);
    dispatch('fileSelected', { file });
  }
</script>

<Button on:click={() => fileInput.click()}>Bild auswählen</Button>
<input bind:this={fileInput} on:change={pictureSelected} type="file" hidden />
{#if imagePreview}
  <img src={imagePreview} alt="Gewähltes Bild" class="w-screen md:w-2/3 self-center" />
{/if}
