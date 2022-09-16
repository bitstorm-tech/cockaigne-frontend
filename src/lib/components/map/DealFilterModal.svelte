<script lang="ts">
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import RangeSelect from "$lib/components/ui/RangeSelect.svelte";
  import type { Category } from "$lib/database/category/category.model";
  import { MapService } from "$lib/map.service";
  import _ from "lodash";
  import { StoreService } from "../../store.service";

  export let categories: Category[] = [];
  export let selectedCategories = StoreService.getCategories();
  export let open = false;
  export let mapService: MapService;
  let searchRadius = StoreService.getSearchRadius();
  const saveRadius = _.debounce(() => {
    StoreService.saveSearchRadius(searchRadius);
  }, 2000);

  function changeSearchRadius() {
    mapService.setRadius(searchRadius);
    saveRadius();
  }

  function toggleCategory(categoryId: number) {
    StoreService.toggleCategories(categoryId);
  }
</script>

<Modal bind:open>
  <div class="flex flex-col m-2 h-[50vh]">
    <RangeSelect
      label="Suche im Umkreis von {searchRadius} m"
      min={100}
      max={1000}
      step={100}
      bind:value={searchRadius}
      on:input={changeSearchRadius}
    />
    <hr class="my-4" />
    {#each categories as category}
      <Checkbox
        label={category.name}
        on:change={() => toggleCategory(+category.id)}
        checked={selectedCategories.includes(+category.id)}
      />
    {/each}
  </div>
</Modal>
