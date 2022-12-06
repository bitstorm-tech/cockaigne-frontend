<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";

  export let buttons: { text: string; callback: () => void }[] = [];
  export let open = false;
</script>

<div class="modal backdrop-blur-sm" class:modal-open={open}>
  <div class="modal-box">
    <slot />
    <div class="modal-action">
      {#if buttons.length > 0}
        {#each buttons as button}
          <Button on:click={button.callback}>{button.text}</Button>
        {/each}
      {:else}
        <Button on:click={() => (open = false)}>OK</Button>
      {/if}
    </div>
  </div>
</div>
