<script lang="ts">
  export let label: string;
  export let options: Record<string | number, unknown>;
  export let value: string | number;
  export let disabled = false;
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <select class="select select-bordered focus:border-primary focus:outline-none text-md" bind:value {disabled}>
    {#each Object.keys(options) as key}
      <option value={+key}>{options[key]}</option>
    {/each}
  </select>
</div>
