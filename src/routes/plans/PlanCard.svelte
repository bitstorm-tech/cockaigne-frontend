<script lang="ts">
  export let title = "Title";
  export let pricePerMonth = "";
  export let pricePerYear = "";
  export let showButton = true;
  export let action: { text: string; callback: () => void } = { text: "Button", callback: () => {} };
</script>

<div class="card w-full bg-blue-600 text-slate-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">{title}</h2>
    {#if pricePerMonth.length > 0}
      <span class="text-xl">{pricePerMonth} € / Monat</span>
    {/if}
    {#if pricePerYear.length > 0}
      <span class="text-xs">({pricePerYear} € / Jahr)</span>
    {/if}
    <slot />
    {#if showButton}
      <div class="card-actions justify-end">
        <button class="btn btn-primary" on:click={action.callback}>{action.text}</button>
      </div>
    {/if}
  </div>
</div>
