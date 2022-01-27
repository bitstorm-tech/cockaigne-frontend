<script lang="ts">
  import DealsList from '$lib/components/deals/DealsList.svelte';
  import FireIcon from '$lib/components/icons/FireIcon.svelte';
  import HeartIcon from '$lib/components/icons/HeartIcon.svelte';
  import ProfileSettings from '$lib/components/profile/ProfileSettings.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import GeoLocation from '$lib/components/ui/GeoLocation.svelte';
</script>

<div class="flex flex-col gap-6">
  <GeoLocation />
  <div class="grid grid-cols-3 gap-2">
    <Button>Favorit</Button>
    <Button><HeartIcon /></Button>
    <Button>Hot <FireIcon /></Button>
  </div>
  <DealsList />
</div>
