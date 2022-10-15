<script lang="ts">
  import { goto } from "$app/navigation";
  import DealsListItem from "$lib/components/dealer/DealsListItem.svelte";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import GearIcon from "$lib/components/ui/icons/GearIcon.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let deals: Deal[] = [];
  let openDetail = -1;
</script>

<div class="flex flex-col gap-4">
  {#if deals.length === 0}
    <EmptyContent>
      <p>Du hast noch keine aktiven Deals. Worauf wartest du?</p>
      <p><Link href="/deals/new" underline>Deal erstellen!</Link></p>
    </EmptyContent>
  {/if}
  {#each deals as deal, i}
    <DealsListItem
      {deal}
      showCompanyName={false}
      showDetails={openDetail === i}
      on:click={() => (openDetail = openDetail === i ? -1 : i)}
    >
      <div slot="right-action" class="cursor-pointer" on:click={() => goto("/deals/" + deal.id.toString())}>
        <GearIcon />
      </div>
    </DealsListItem>
  {/each}
</div>
