<script lang="ts">
  import DealsList from '$lib/components/deals/DealsList.svelte';
  import FireIcon from '$lib/components/icons/FireIcon.svelte';
  import HeartIcon from '$lib/components/icons/HeartIcon.svelte';
  import ProfileSettings from '$lib/components/profile/ProfileSettings.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import GeoLocation from '$lib/components/ui/GeoLocation.svelte';
</script>

<ProfileSettings />
<div class="p-4">
  <GeoLocation />
</div>
<div class="flex space-x-3 p-4 justify-items-stretch mt-14">
  <Button fullwidth>Favorit</Button>
  <Button fullwidth><span class="flex justify-around"><HeartIcon /></span></Button>
  <Button fullwidth><span class="flex justify-around">Hot <FireIcon /></span></Button>
</div>
<DealsList />
