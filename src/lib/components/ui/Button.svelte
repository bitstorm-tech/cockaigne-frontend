<script lang="ts">
  export let type = '';
  export let fullwidth = false;
</script>

<button class:w-full={fullwidth} class="bg-stone-200 p-2 border rounded-md hover:shadow-lg" {type} on:click>
  <slot />
</button>
