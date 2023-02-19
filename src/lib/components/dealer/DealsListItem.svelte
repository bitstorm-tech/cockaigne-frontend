<script lang="ts">
  import { page } from "$app/stores";
  import { Categories } from "$lib/categories";
  import DealListItemDetails from "$lib/components/dealer/DealListItemDetails.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import CrossIcon from "../ui/icons/CrossIcon.svelte";

  export let deal: Deal;
  export let showDetails = false;
  export let showCompanyName = true;

  $: category = Categories[deal?.category_id] || { icon: CrossIcon, color: "fuchsia" };

  const isUser = !$page.data.user.isDealer;
</script>

<div class="flex gap-2 items-center">
  <div class="flex flex-col grow">
    {#if showCompanyName}
      <div class="flex justify-between px-2 py-0.5 bg-[#232b2e]">
        <a href="/dealer/{deal.dealer_id}" class="flex items-center text-[#b2b2b2]">
          {deal.username}
        </a>
        <a href="/dealer/{deal.dealer_id}" class="text-[#617780]">>></a>
      </div>
    {/if}
    <button class="flex justify-between bg-[#2c363a] items-center" on:click>
      <div class="flex gap-2 items-center">
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
      <DealListItemDetails {deal} {isUser} />
    {/if}
  </div>
</div>
