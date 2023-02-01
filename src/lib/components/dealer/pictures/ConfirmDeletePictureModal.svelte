<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";

  export let open = false;
  export let url = "";
  export let deleteFunction;

  function del() {
    deleteFunction();
    close();
  }

  function close() {
    open = false;
  }

  const buttons = [
    { text: "Ja", callback: del },
    { text: "Nein", callback: close }
  ];
</script>

<Modal bind:open {buttons}>
  <div class="flex flex-col gap-3">
    <img loading="lazy" src={url} alt="Dealer Impression to delete" />
    <b class="text-large">Dieses Bild wirklich löschen?</b>
  </div>
</Modal>
