<script lang="ts">
  import { MONTH_MAPPING } from "$lib/date-time.utils";

  export let data;
  const invoiceOverviews = data.invoiceOverviews || [];
</script>

<section class="m-4">
  <h1 class="text-center">Rechnungen</h1>
  <div class="flex flex-col gap-5">
    {#each invoiceOverviews as overview}
      <a class="grid grid-cols-3" href={`/invoice/${overview.year}-${overview.month}`}>
        <span>{overview.year} {MONTH_MAPPING[overview.month]}</span>
        <span>{overview.numberOfDeals} Deals</span>
        <span>{overview.totalAmount.toFixed(2)} €</span>
      </a>
    {/each}
  </div>
</section>
