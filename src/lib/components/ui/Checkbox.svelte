<script lang="ts">
  export let label: string;
  export let id = label?.toLowerCase();
  export let checked = false;
  export let disabled = false;
</script>

<div class="inline-flex">
  <label class="label cursor-pointer gap-2 px-0">
    <input {id} class="checkbox" type="checkbox" bind:checked {disabled} />
    <span class="label-text">{label}</span>
  </label>
</div>
