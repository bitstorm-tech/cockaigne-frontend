<script lang="ts">
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import UserDealListItme from "$lib/components/user/UserDealListItme.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let deals: Deal[] = [];
  let openDetail = -1;
</script>

<div class="flex flex-col gap-2">
  {#if deals.length === 0}
    <EmptyContent>
      <p>Aktuell gibt es leider keine Deals in deiner Nähe :(</p>
      <p>
        <Link href="/map?showFilter=true" underline>Filter anpassen</Link>
        oder
        <Link href="/map" underline>Standort ändern</Link>
        !
      </p>
    </EmptyContent>
  {/if}
  {#each deals as deal, i}
    <UserDealListItme {deal} openDetail={openDetail === i} on:click={() => (openDetail = openDetail === i ? -1 : i)} />
  {/each}
</div>
