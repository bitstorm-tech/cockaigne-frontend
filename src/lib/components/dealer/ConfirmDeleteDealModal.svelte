<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";

  export let open = false;
  export let dealTitle = "";
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
  Deal <b>{dealTitle}</b> wirklich löschen?
</Modal>
