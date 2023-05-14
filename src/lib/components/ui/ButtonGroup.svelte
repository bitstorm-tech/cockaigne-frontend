<script lang="ts">
  export let options: Record<string, string>;
  export let label = "";
  export let value: number;
  export let disabled = false;

  let activeButton = value;
</script>

<div class="form-control">
  {#if label.length > 0}
    <label class="label">
      <span class="label-text text-xs">{label}</span>
    </label>
  {/if}
  <div class="btn-group">
    {#each Object.keys(options) as key}
      <button
        class="btn-outline btn-sm btn grow"
        class:btn-active={activeButton === key}
        on:click={() => (activeButton = value = key)}
        {disabled}
      >
        {options[key]}
      </button>
    {/each}
  </div>
</div>
