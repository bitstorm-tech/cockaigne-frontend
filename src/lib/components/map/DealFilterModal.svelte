<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import RangeSelect from "$lib/components/ui/RangeSelect.svelte";
  import type { Category } from "$lib/database/category/category.model";
  import type { MapService } from "$lib/map.service";
  import { StoreService } from "$lib/store.service";
  import { selectedCategoriesStore } from "$lib/stores/category.store";
  import { debounce, union, without } from "lodash";
  import { get } from "svelte/store";

  export let categories: Category[] = [];
  export let open = false;
  export let mapService: MapService;
  let searchRadius = StoreService.getSearchRadius();
  $: sortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));

  const buttons = [
    {
      text: "Übernehmen",
      callback: () => {
        open = false;
      }
    }
  ];

  selectedCategoriesStore.load();

  const saveRadius = debounce(() => {
    StoreService.saveSearchRadius(searchRadius);
  }, 2000);

  const saveSelectedCategories = debounce(() => {
    selectedCategoriesStore.save();
  }, 2000);

  function changeSearchRadius() {
    mapService.setRadius(searchRadius);
    saveRadius();
  }

  function toggleCategory(categoryId: number, checked: boolean) {
    if (checked) {
      selectedCategoriesStore.update((oldState) => union(oldState, [categoryId]));
    } else {
      selectedCategoriesStore.update((oldState) => without(oldState, categoryId));
    }

    saveSelectedCategories();
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

    saveSelectedCategories();
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
