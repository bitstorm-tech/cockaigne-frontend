<script>
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import Button from "$lib/components/ui/Button.svelte";
</script>

<div class="flex flex-col gap-4 overflow-scroll h-full">
  <div class="mx-auto">
    <Button href="/create-deal" small>Neuen Deal erstellen</Button>
  </div>
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
  <DealsListItem />
</div>
