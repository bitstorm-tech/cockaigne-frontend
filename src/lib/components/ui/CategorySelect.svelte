<script lang="ts">
  import Select from "$lib/components/ui/Select.svelte";
  import type { Category } from "$lib/database/category/category.model";
  import { categoryStore } from "$lib/database/category/category.store";

  export let label = "Kategorie";
  export let value: string | number;
  export let disabled = false;

  categoryStore.load();
  const categories = Object.fromEntries($categoryStore.map((category: Category) => [+category.id, category.name]));
</script>

<Select {label} options={categories} bind:value {disabled} />
