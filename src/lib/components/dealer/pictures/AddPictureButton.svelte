<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import PlusIcon from "$lib/components/ui/icons/PlusIcon.svelte";
  import { createEventDispatcher } from "svelte";

  let file: File;
  let fileInput: HTMLInputElement;
  const dispatch = createEventDispatcher();

  async function fileSelected(event) {
    file = event.target.files[0] as File;
    dispatch("select", file);
  }
</script>

<Button circle on:click={() => fileInput.click()}>
  <PlusIcon />
</Button>
<input bind:this={fileInput} on:change={fileSelected} type="file" hidden />
