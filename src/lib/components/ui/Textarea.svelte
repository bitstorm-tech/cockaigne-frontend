<script lang="ts">
  export let label: string;
  export let id = label?.toLowerCase();
  export let placeholder = "";
  export let value = "";
  export let disabled = false;
  export let lines = 5;
  export let resize = true;
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <textarea
    {id}
    class:resize-none={!resize}
    class="textarea-bordered textarea focus:border-primary focus:outline-none"
    rows={lines}
    {placeholder}
    {disabled}
    bind:value
  />
</div>
