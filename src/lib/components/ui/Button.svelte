<script lang="ts">
  export let type = '';
  export let small = false;
</script>

<button class="btn btn-outline" class:btn-sm={small} {type} on:click>
  <slot />
</button>
