<script lang="ts">
  import Input from "$lib/components/ui/Input.svelte";

  export let label: string;
  export let id = label?.toLowerCase();
  export let placeholder = "";
  export let value = new Date().toISOString().substring(0, 16);
</script>

<Input type="datetime-local" {id} {label} {placeholder} bind:value />
