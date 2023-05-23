<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import RangeSelect from "$lib/components/ui/RangeSelect.svelte";
  import { setRadius } from "$lib/map.service";
  import { selectedCategoriesStore } from "$lib/stores/category.store";
  import { searchRadiusStore } from "$lib/stores/search-radius.store";
  import { updateSelectedCategory } from "$lib/supabase/category-service";
  import { saveSearchRadius } from "$lib/supabase/location-service";
  import type { Category } from "$lib/supabase/public-types";
  import debounce from "lodash/debounce";
  import union from "lodash/union";
  import without from "lodash/without";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  export let categories: Category[] = [];
  export let open = false;
  let searchRadius = 0;
  const supabase = $page.data.supabase;
  const userId = $page.data.userId;

  onMount(async () => {
    searchRadius = $searchRadiusStore;
  });

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        open = false;
      }
    }
  ];

  selectedCategoriesStore.load(supabase);

  const saveRadius = debounce(() => {
    if (!userId) return;
    saveSearchRadius(supabase, userId, searchRadius);
  }, 2000);

  const saveSelectedCategoriesDebounced = debounce(() => {
    if (!userId) return;
    updateSelectedCategory(supabase, userId, $selectedCategoriesStore);
  }, 2000);

  function changeSearchRadius() {
    setRadius(searchRadius);
    searchRadiusStore.set(searchRadius);
    saveRadius();
  }

  function toggleCategory(categoryId: number, checked: boolean) {
    if (checked) {
      selectedCategoriesStore.update((oldState) => union(oldState, [categoryId]));
    } else {
      selectedCategoriesStore.update((oldState) => without(oldState, categoryId));
    }

    saveSelectedCategoriesDebounced();
  }

  function toggleAllCategories() {
    const selectedCategories = get(selectedCategoriesStore);

    if (selectedCategories.length > 0) {
      selectedCategoriesStore.update(() => []);
    } else {
      selectedCategoriesStore.update(() => {
        return categories.map((category) => +category.id);
      });
    }

    saveSelectedCategoriesDebounced();
  }
</script>

<Modal bind:open {buttons}>
  <div class="m-2 flex max-h-[60vh] flex-col">
    <div class="flex flex-col gap-3">
      <RangeSelect
        label="Suche im Umkreis von {searchRadius} m"
        min={500}
        max={15000}
        step={500}
        bind:value={searchRadius}
        on:input={changeSearchRadius}
      />
      <Button small on:click={toggleAllCategories}>Alle Filter aktivieren / deaktivieren</Button>
    </div>
    <hr class="my-4" />
    <div class="flex flex-col gap-x-4 overflow-auto">
      {#each categories as category}
        <Checkbox
          label={category.name}
          on:change={(event) => toggleCategory(+category.id, event.target.checked)}
          checked={$selectedCategoriesStore.includes(+category.id)}
        />
      {/each}
    </div>
  </div>
</Modal>
