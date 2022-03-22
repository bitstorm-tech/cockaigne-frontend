<script lang="ts">
  export let label: string;
  export let id = label?.toLowerCase();
  export let checked = false;
</script>

<div class="inline-flex">
  <label class="label cursor-pointer gap-2">
    <input {id} class="checkbox" type="checkbox" {checked} />
    <span class="label-text">{label}</span>
  </label>
</div>
