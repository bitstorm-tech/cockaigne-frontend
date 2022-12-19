<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  export let open = false;
  export let index = 0;
  export let imageUrls: string[] = [];
  export let title = "Bilder";

  function next() {
    index = index === imageUrls.length - 1 ? 0 : ++index;
  }

  function previous() {
    index = index === 0 ? imageUrls.length - 1 : --index;
  }
</script>

<Modal bind:open>
  <div class="flex flex-col gap-3 max-h-[75vh]">
    <div class="overflow-auto">
      <img src={imageUrls[index]} alt="Dealer shop impression or deal images" />
    </div>
    <div class="flex items-center">
      <Button on:click={previous} circle>&lt;</Button>
      <div class="flex flex-col grow text-center">
        <p>{title}</p>
        <p class="text-xs">({index + 1}/{imageUrls.length})</p>
      </div>
      <Button on:click={next} circle>&gt;</Button>
    </div>
  </div>
</Modal>
