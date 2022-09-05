<script lang="ts">
  export let value;
  export let label;
  export let id = label?.toLowerCase();
  export let step;
  export let min;
  export let max;
</script>

<div class="form-control w-full">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <input {id} class="range" type="range" {min} {max} {step} bind:value on:input />
</div>
