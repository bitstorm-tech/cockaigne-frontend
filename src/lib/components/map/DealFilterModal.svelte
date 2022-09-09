<script lang="ts">
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import RangeSelect from "$lib/components/ui/RangeSelect.svelte";
  import { MapService } from "$lib/map.service";
  import _ from "lodash";
  import { UserService } from "../../user.service";

  export let open = false;
  export let mapService: MapService;
  let searchRadius = UserService.getSearchRadius();
  const saveRadius = _.debounce(() => {
    UserService.saveSearchRadius(searchRadius);
  }, 2000);

  function changeSearchRadius() {
    mapService.setRadius(searchRadius);
    saveRadius();
  }
</script>

<Modal bind:open>
  <div class="flex flex-col m-2">
    <RangeSelect
      label="Suche im Umkreis von {searchRadius} m"
      min={100}
      max={1000}
      step={100}
      bind:value={searchRadius}
      on:input={changeSearchRadius}
    />
    <hr class="my-4" />
    <Checkbox label="Aktuellen Standort verwenden" />
    <Checkbox label="Standort per Click wählen" />
  </div>
</Modal>
