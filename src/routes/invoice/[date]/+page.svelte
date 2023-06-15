<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import BackIcon from "$lib/components/ui/icons/BackIcon.svelte";
  import PrintIcon from "$lib/components/ui/icons/PrintIcon.svelte";
  import { formatDate } from "$lib/date-time.utils";
  import type { Deal } from "$lib/supabase/public-types";
  import type { PageData } from "./$types";

  export let data: PageData;

  function calculatePrice(deal: Deal): string {
    return ((deal.duration / 24) * 4.99).toFixed(2) + " €";
  }

  function calculateSumPrice(deals: Deal[]): string {
    const totalDuration = deals.map((deal) => deal.duration).reduce((prev, current) => prev + current, 0);
    return ((totalDuration / 24) * 4.99).toFixed(2) + " €";
  }
</script>

<section>
  {#if !data.invoiceData}
    <h1 class="text-center">Leider kann die Rechnung gerade nicht angezeigt werden.</h1>
  {:else}
    <div class="mt-6 flex items-center justify-center gap-6">
      <a href="/invoices-overview">
        <BackIcon />
      </a>
      <p class="text-center text-2xl">Rechnung vom {data.monthWord} {data.year}</p>
    </div>
    <div id="invoice" class="m-4 flex flex-col gap-5 rounded-md bg-white p-2 text-black">
      <p>Rechnung-Nr.: {data.invoiceData?.invoiceNumber}</p>
      <div class="flex justify-between">
        <div>
          <div>{data.invoiceData.address.name}</div>
          <div>{data.invoiceData.address.street} {data.invoiceData.address.houseNumber}</div>
          <div>{data.invoiceData.address.postcode} {data.invoiceData.address.city}</div>
        </div>
        <div>
          <div>BBS Technology GmbH</div>
          <div>Elsa-Brandström-Str. 84</div>
          <div>44795 Bochum</div>
        </div>
      </div>
      <div>
        {#each data.invoiceData.deals as deal}
          <div class="flex justify-between">
            <p>{deal.title} ({formatDate(deal.start)})</p>
            <p>{calculatePrice(deal)}</p>
          </div>
        {/each}
      </div>
      <div class="text-right">{calculateSumPrice(data.invoiceData.deals)}</div>
    </div>
    <div class="fixed bottom-20 right-8">
      <Button on:click={() => window.print()} circle>
        <PrintIcon />
      </Button>
    </div>
  {/if}
</section>

<style>
  @media print {
    :global(body) {
      visibility: hidden;
    }

    #invoice {
      visibility: visible;
    }
  }
</style>
