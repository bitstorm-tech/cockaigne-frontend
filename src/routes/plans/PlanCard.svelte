<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";

  export let titleLeft = "";
  export let titleRight = "";
  export let showButton = true;
  export let action: { text: string; callback: () => void } = { text: "Button", callback: () => {} };
  export let hasActiveSubscription = true;

  export let loading = false;

  function clickHandler() {
    loading = true;
    action.callback();
  }
</script>

<div class="card w-full bg-white text-primary shadow-xl">
  <div class="card-body gap-6">
    <span class="card-title w-full justify-between">
      <span>{titleLeft}</span>
      <span class="text-sm">{titleRight}</span>
    </span>
    <slot />
    <div class="card-actions justify-end">
      {#if showButton}
        <Button {loading} warning on:click={clickHandler}>{action.text}</Button>
      {/if}
      {#if hasActiveSubscription}
        <span>Du hast bereits ein aktives Abo!</span>
      {/if}
    </div>
  </div>
</div>
