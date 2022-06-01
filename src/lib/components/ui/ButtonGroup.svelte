<script lang="ts">
  export let options: Record<unknown, unknown>;
  export let label: string;
  export let value: string;

  let activeButton = value;
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <div class="btn-group">
    {#each Object.keys(options) as key}
      <button
        class="btn btn-sm btn-outline grow"
        class:btn-active={activeButton === key}
        on:click={() => (activeButton = value = key)}
      >
        {options[key]}
      </button>
    {/each}
  </div>
</div>
