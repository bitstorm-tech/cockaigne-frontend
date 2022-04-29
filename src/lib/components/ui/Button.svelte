<script lang="ts">
  export let disabled = false;
  export let type = "";
  export let small = false;
  export let loading = false;
  export let outline = false;
  export let circle = false;
</script>

<button
  class="btn"
  class:loading
  class:btn-outline={outline}
  class:btn-sm={small}
  class:btn-circle={circle}
  {type}
  {disabled}
  on:click
>
  <slot />
</button>
