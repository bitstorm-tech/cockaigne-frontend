<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import PlusIcon from "$lib/components/ui/icons/PlusIcon.svelte";

  export let file: File;
  let fileInput: HTMLInputElement;

  async function fileSelected(event) {
    file = event.target.files[0] as File;
    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/pictures", { method: "post", body: formData });
  }
</script>

<Button outline circle on:click={() => fileInput.click()}>
  <PlusIcon />
</Button>
<input bind:this={fileInput} on:change={fileSelected} type="file" hidden />
