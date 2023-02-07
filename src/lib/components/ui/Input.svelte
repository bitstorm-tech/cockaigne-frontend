<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label = "";
  export let id = label + Math.random().toString();
  export let type = "text";
  export let placeholder = "";
  export let value = "";
  export let disabled = false;
  export let min = "";
  export let centerText = false;
  export let maxlength = -1;
  export let letterSpacing = false;

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
  <label class="label" for={id}>
    <span class="label-text text-xs">{label}</span>
  </label>
  <input
    class="input input-bordered focus:border-primary focus:outline-none"
    class:text-center={centerText}
    class:tracking-[0.5rem]={letterSpacing}
    {id}
    {type}
    {placeholder}
    {value}
    {min}
    {disabled}
    {maxlength}
    on:input={setValue}
    on:keydown={keydown}
  />
</div>
