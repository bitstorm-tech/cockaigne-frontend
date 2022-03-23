<script lang="ts">
  export let label: string;
  export let id = label?.toLowerCase();
  export let type = "text";
  export let placeholder = "";
  export let value = "";

  function setValue(event) {
    value = event.target.value;
  }
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <input class="input input-bordered focus:outline-none" {id} {type} {placeholder} on:input={setValue} {value} />
</div>
