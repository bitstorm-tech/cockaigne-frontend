<script lang="ts">
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import RangeSelect from "$lib/components/ui/RangeSelect.svelte";
  import type { Category } from "$lib/database/category/category.model";
  import { MapService } from "$lib/map.service";
  import { debounce, union, without } from "lodash";
  import { selectedCategoriesStore } from "../../database/category/category.store";
  import { StoreService } from "../../store.service";

  export let categories: Category[] = [];
  export let open = false;
  export let mapService: MapService;
  let searchRadius = StoreService.getSearchRadius();
  $: sortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));

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
</script>

<Modal bind:open>
  <div class="flex flex-col m-2 max-h-[60vh]">
    <RangeSelect
      label="Suche im Umkreis von {searchRadius} m"
      min={100}
      max={1000}
      step={100}
      bind:value={searchRadius}
      on:input={changeSearchRadius}
    />
    <hr class="my-4" />
    <div class="flex flex-wrap gap-x-4 overflow-auto">
      {#each categories as category}
        <Checkbox
          label={category.name}
          on:change={(event) => toggleCategory(+category.id, event.target.checked)}
          checked={$selectedCategoriesStore?.includes(+category.id)}
        />
      {/each}
    </div>
  </div>
</Modal>
