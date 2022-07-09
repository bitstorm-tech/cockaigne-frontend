<script lang="ts">
  export let label: string;
  export let id = label?.toLowerCase();
  export let placeholder = "";
  export let value = "";
  export let disabled = false;
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <textarea
    {id}
    class="textarea textarea-bordered h-40 focus:border-primary focus:outline-none"
    {placeholder}
    {disabled}
    bind:value
  />
</div>
