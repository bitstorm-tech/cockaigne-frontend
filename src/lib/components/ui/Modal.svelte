<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";

  export let buttons: { text: string; callback: () => void; outline?: boolean }[] = [];
  export let open = false;
</script>

<div class="modal" class:modal-open={open}>
  <div class="modal-box">
    <slot />
    <div class="modal-action">
      {#if buttons.length > 0}
        {#each buttons as button}
          <Button outline={button.outline} on:click={button.callback}>{button.text}</Button>
        {/each}
      {:else}
        <Button on:click={() => (open = false)}>OK</Button>
      {/if}
    </div>
  </div>
</div>
