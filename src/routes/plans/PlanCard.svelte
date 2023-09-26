<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";

  export let titleLeft = "";
  export let titleRight = "";
  export let showButton = true;
  export let action: { text: string; callback: () => void } = { text: "Button", callback: () => {} };
</script>

<div class="card w-full bg-white text-primary shadow-xl">
  <div class="card-body gap-6">
    <span class="card-title w-full justify-between">
      <span>{titleLeft}</span>
      <span class="text-sm">{titleRight}</span>
    </span>
    <slot />
    {#if showButton}
      <div class="card-actions justify-end">
        <Button warning on:click={action.callback}>{action.text}</Button>
      </div>
    {/if}
  </div>
</div>
