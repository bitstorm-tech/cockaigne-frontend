<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";

  export let favoriteDeals = [];
</script>

<ul class="h-full overflow-auto">
  <DealsList deals={favoriteDeals} favoriteDeals={favoriteDeals.map((deal) => deal._id.toString())} on:favor />
</ul>
