<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let label: string;
  export let id = label?.toLowerCase();
  export let type = "text";
  export let placeholder = "";
  export let value = "";
  export let disabled = false;

  const disaptch = createEventDispatcher();

  function setValue(event) {
    value = event.target.value;
  }

  function keydown(event: KeyboardEvent) {
    if (event.code === "Enter") {
      disaptch("enter");
    }
  }
</script>

<div class="form-control w-full">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <input
    class="input input-bordered focus:border-primary focus:outline-none"
    {id}
    {type}
    {placeholder}
    {value}
    {disabled}
    on:input={setValue}
    on:keydown={keydown}
  />
</div>
