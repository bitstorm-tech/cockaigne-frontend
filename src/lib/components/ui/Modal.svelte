<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let open = false;

  function close() {
    open = false;
    dispatch("close");
  }
</script>

<div class="modal" class:modal-open={open}>
  <div class="modal-box">
    <slot />
    <div class="modal-action">
      <Button on:click={close}>Okidoki</Button>
    </div>
  </div>
</div>
