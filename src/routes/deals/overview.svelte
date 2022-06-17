<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  let showTabIndex = 0;
</script>

<div class="flex flex-col p-3">
  <div class="grid grid-cols-2 gap-3">
    <Button><a href="/deals/new">Deal erstellen</a></Button>
    <Button outline>Vorlagen</Button>
  </div>
</div>
<div class="tabs mt-6 max-h-8 mb-2">
  <button on:click={() => (showTabIndex = 0)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 0}>
    Aktiv
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 1}>
    Geplant
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 2}>
    Abgelaufen
  </button>
</div>
