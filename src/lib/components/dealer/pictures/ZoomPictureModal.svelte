<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";

  export let open = false;
  export let url = "";

  function close() {
    open = false;
  }

  const buttons = [{ text: "Schön!", callback: close }];
</script>

<Modal bind:open {buttons}>
  <div class="flex flex-col gap-3">
    <img src={url} alt="Dealer Impression to delete" />
  </div>
</Modal>
