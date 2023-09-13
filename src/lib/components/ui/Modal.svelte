<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import CrossIcon from "./icons/CrossIcon.svelte";

  export let buttons: { text: string; callback: () => void; warning?: boolean }[] = [];
  export let open = false;
  export let openCallback = () => {};
  const showButtons = buttons.length > 0;

  $: open && openCallback();
</script>

<div class="modal backdrop-blur-sm" class:modal-open={open}>
  <div class="modal-box">
    <button class="btn btn-circle btn-primary btn-sm absolute right-2 top-2 z-20" on:click={() => (open = false)}>
      <CrossIcon size={1.3} />
    </button>
    <slot />
    {#if showButtons}
      <div class="modal-action">
        {#each buttons as button}
          <Button on:click={button.callback} warning={button.warning}>{button.text}</Button>
        {/each}
      </div>
    {/if}
  </div>
</div>
