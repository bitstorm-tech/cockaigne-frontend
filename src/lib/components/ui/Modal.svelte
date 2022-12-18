<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";

  export let buttons: { text: string; callback: () => void }[] = [];
  export let open = false;
  const showButtons = buttons.length > 0;
</script>

<div class="modal backdrop-blur-sm" class:modal-open={open}>
  <div class="modal-box">
    {#if !showButtons}
      <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={() => (open = false)}>X</button>
    {/if}
    <slot />
    {#if showButtons}
      <div class="modal-action">
        {#each buttons as button}
          <Button on:click={button.callback}>{button.text}</Button>
        {/each}
      </div>
    {/if}
  </div>
</div>
