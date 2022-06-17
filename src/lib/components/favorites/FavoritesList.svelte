<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let favoriteDeals: Deal[] = [];
</script>

<ul class="h-full overflow-auto">
  <DealsList deals={favoriteDeals} {favoriteDeals} on:favor />
</ul>
