<script lang="ts">
  export let label: string;
  export let id = label.toLowerCase();
  export let type = 'text';
  export let placeholder = '';
  export let value = '';
</script>

<div class="w-full">
  <label for={id} class="pl-1 text-xs">{label}</label>
  <input
    class="p-2 w-full border rounded-md hover:border-primary focus:border-primary focus:outline-none"
    {id}
    {type}
    {placeholder}
    on:change
    on:input={(event) => (value = event.target.value)}
  />
</div>
