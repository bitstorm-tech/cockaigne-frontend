<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label: string;
  export let id = label?.toLowerCase();
  export let type = "text";
  export let placeholder = "";
  export let value = "";
  export let disabled = false;
  export let min = "";

  const dispatch = createEventDispatcher();

  function setValue(event) {
    value = event.target.value;
  }

  function keydown(event: KeyboardEvent) {
    if (event.code === "Enter") {
      dispatch("enter");
    }
  }
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <input
    class="input input-bordered focus:border-primary focus:outline-none"
    {id}
    {type}
    {placeholder}
    {value}
    {min}
    {disabled}
    on:input={setValue}
    on:keydown={keydown}
  />
</div>
