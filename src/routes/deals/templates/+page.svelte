<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let data;
  const templates: Deal[] = data.templates;
</script>

<div class="pt-4">
  <DealsList deals={templates} />
</div>
