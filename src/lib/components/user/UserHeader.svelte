<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import LocationIcon from "$lib/components/ui/icons/LocationIcon.svelte";
  import DealsBadge from "$lib/components/user/DealsBadge.svelte";
  import FavoriteDealerBadge from "$lib/components/user/FavoriteDealerBadge.svelte";
  import HotsBadge from "$lib/components/user/HotsBadge.svelte";

  export let name = "";
  export let address = "";
  export let imageUrl = "";
  export let favoriteDealers = 0;
  export let hotDeals = 0;
  export let deals = 0;
</script>

<div class="flex justify-between text-[#dbdce6]">
  <div class="flex justify-between w-full">
    <div class="flex flex-col pt-2 gap-4 m-4">
      <div class="flex justify-between text-[#69828c] fill-current">
        <DealsBadge number={deals} />
        <HotsBadge number={hotDeals} />
        <FavoriteDealerBadge number={favoriteDealers} />
      </div>
      <span class="text-2xl">{name}</span>
      <span class="flex flex-col gap-2 text-sm">
        <b>Dein Standort</b>
        <span class="flex gap-1"><LocationIcon size="1" /><i class="text-xs">{address}</i></span>
      </span>
    </div>
    <div class="flex flex-col -mt-6 mr-14">
      <div class="w-24 h-24 z-10">
        <ProfilePicture {imageUrl} />
      </div>
    </div>
  </div>
</div>
