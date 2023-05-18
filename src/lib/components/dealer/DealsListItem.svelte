<script lang="ts">
  import { Categories } from "$lib/categories";
  import DealListItemDetails from "$lib/components/dealer/DealListItemDetails.svelte";
  import type { ActiveDeal, Deal } from "$lib/supabase/public-types";
  import CrossIcon from "../ui/icons/CrossIcon.svelte";

  export let deal: Deal | ActiveDeal;
  export let showDetails = false;
  export let showCompanyName = true;

  $: category = Categories[deal?.category_id] || { icon: CrossIcon, color: "fuchsia" };
</script>

<div class="flex items-center">
  <div class="flex grow flex-col">
    {#if showCompanyName}
      <div class="flex justify-between bg-[#232b2e] px-2 py-0.5">
        <a href="/dealer/{deal.dealer_id}" class="flex items-center text-[#b2b2b2]">
          {deal.username}
        </a>
        <a href="/dealer/{deal.dealer_id}" class="text-[#617780]">>></a>
      </div>
    {/if}
    <button class="flex items-center justify-between bg-[#2c363a]" on:click>
      <div class="flex items-center gap-2">
        <div class="m-2 rounded" style="background: {category.color}">
          <svelte:component this={category.icon} size="2.8" />
        </div>
        <div class="text-[#fff4eb]">{deal.title}</div>
      </div>
      <button class="mr-3" on:click|preventDefault style="color: {category.color}">
        <slot name="right-action" />
      </button>
    </button>
    {#if showDetails}
      <DealListItemDetails {deal} />
    {/if}
  </div>
</div>
