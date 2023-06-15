<script lang="ts">
  import { MONTH_MAPPING } from "$lib/date-time.utils";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<section class="m-4">
  <h1 class="text-center">Rechnungen</h1>
  <ul class="flex flex-col gap-5">
    {#each data.invoiceDates as date}
      <li>
        <a href={`/invoice/${date.year}-${date.month}`}>{date.year} {MONTH_MAPPING[date.month]}</a>
      </li>
    {/each}
  </ul>
</section>
