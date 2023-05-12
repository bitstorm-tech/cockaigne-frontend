<script lang="ts">
  import { page } from "$app/stores";
  import Select from "$lib/components/ui/Select.svelte";
  import { categoryStore } from "$lib/stores/category.store";
  import type { Category } from "$lib/supabase/public-types";

  export let label = "Kategorie";
  export let value: string | number;
  export let disabled = false;

  categoryStore.load($page.data.supabase);
  $: categories = Object.fromEntries($categoryStore.map((category: Category) => [+category.id, category.name]));
</script>

<Select {label} options={categories} bind:value {disabled} />
