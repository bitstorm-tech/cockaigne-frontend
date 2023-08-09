<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";

  export let open = false;
  export let text = "";
  export let conformationCallback: () => void;

  function confirm() {
    conformationCallback();
    close();
  }

  function close() {
    open = false;
  }

  const buttons = [
    { text: "Ja", callback: confirm },
    { text: "Nein", callback: close }
  ];
</script>

<Modal bind:open {buttons}>
  <div class="flex flex-col gap-3">
    <b class="text-large">{text}</b>
  </div>
</Modal>
