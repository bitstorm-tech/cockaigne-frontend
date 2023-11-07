<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label: string;
  export let id = label?.toLowerCase();
  export let placeholder = "";
  export let value = "";
  export let disabled = false;
  export let lines = 5;
  export let resize = true;

  const dispatch = createEventDispatcher();

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
  <textarea
    {id}
    class:resize-none={!resize}
    class="textarea textarea-bordered focus:border-primary focus:outline-none"
    maxlength="1000"
    rows={lines}
    {placeholder}
    {disabled}
    bind:value
    on:keydown={keydown} />
</div>
