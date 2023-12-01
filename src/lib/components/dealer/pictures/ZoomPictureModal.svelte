<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  export let open = false;
  export let index = 0;
  export let imageUrls: string[] = [];

  function next() {
    index = index === imageUrls.length - 1 ? 0 : ++index;
  }

  function previous() {
    index = index === 0 ? imageUrls.length - 1 : --index;
  }
</script>

<Modal bind:open>
  <div class="flex max-h-[75vh] flex-col gap-3">
    <div class="overflow-auto">
      <img src={imageUrls[index]} alt="Dealer shop impression or deal images" />
    </div>
    <div class="flex items-center justify-between text-[#fff4eb]">
      <Button on:click={previous} circle>&lt;</Button>
      <Button on:click={next} circle>&gt;</Button>
    </div>
  </div>
</Modal>
