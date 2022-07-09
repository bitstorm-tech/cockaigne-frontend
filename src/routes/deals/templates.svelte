<script lang="ts" context="module">
  import type { LoadEvent } from "@sveltejs/kit";

  export async function load({ fetch }: LoadEvent) {
    const response = await fetch("/api/deals/templates");

    if (response.ok) {
      const templates = await response.json();
      return {
        props: {
          templates
        }
      };
    }
  }
</script>

<script lang="ts">
  import DealsList from "$lib/components/dealer/DealsList.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";

  export let templates: Deal[];
</script>

<div class="pt-4">
  <DealsList deals={templates} />
</div>
