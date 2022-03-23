<script lang="ts">
  export let buttons: string[];
  export let label: string;

  let activeButton = 0;
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <div class="btn-group">
    {#each buttons as button, i}
      <button
        class="btn btn-sm btn-outline grow"
        class:btn-active={activeButton === i}
        on:click={() => (activeButton = i)}
      >
        {button}
      </button>
    {/each}
  </div>
</div>
