<script lang="ts">
  import { page } from "$app/stores";
  import EmptyContent from "$lib/components/ui/EmptyContent.svelte";
  import UserDealListItme from "$lib/components/user/UserDealListItme.svelte";
  import { hotDealStore } from "$lib/stores/hot-deal.store";
  import { onMount } from "svelte";
  import LoadingSpinner from "../ui/icons/LoadingSpinner.svelte";

  let loading = true;
  let openDetail = -1;

  onMount(async () => {
    const userId = $page.data.userId;

    if (userId) {
      await hotDealStore.load($page.data.supabase, userId);
      hotDealStore.rotateByCurrentTime();
    }

    loading = false;
  });
</script>

<div class="flex flex-col justify-center gap-2">
  {#if loading}
    <EmptyContent>
      <LoadingSpinner />
      <p>Lade das heiße Zeug ...</p>
    </EmptyContent>
  {:else}
    {#if $hotDealStore.length === 0}
      <EmptyContent>
        <p>Hier gibt es noch keine heißen Deals.</p>
      </EmptyContent>
    {/if}
    {#each $hotDealStore as deal, i}
      <UserDealListItme
        {deal}
        openDetail={openDetail === i}
        on:click={() => (openDetail = openDetail === i ? -1 : i)}
      />
    {/each}
  {/if}
</div>
