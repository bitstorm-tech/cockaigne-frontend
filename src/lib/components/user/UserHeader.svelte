<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import LocationIcon from "$lib/components/ui/icons/LocationIcon.svelte";
  import DealsBadge from "$lib/components/user/DealsBadge.svelte";
  import FavoriteDealerBadge from "$lib/components/user/FavoriteDealerBadge.svelte";
  import HotsBadge from "$lib/components/user/HotsBadge.svelte";

  export let name = "";
  export let address: string[] = [""];
  export let imageUrl = "";
  export let favoriteDealers = 0;
  export let hotDeals = 0;
  export let deals = 0;
</script>

<div class="flex justify-between text-[#dbdce6]">
  <div class="flex w-full justify-between">
    <div class="m-4 flex flex-col gap-4 pt-2">
      <div class="flex justify-between fill-current text-[#69828c]">
        <DealsBadge number={deals} />
        <HotsBadge number={hotDeals} />
        <FavoriteDealerBadge number={favoriteDealers} />
      </div>
      <span class="text-2xl">{name}</span>
      <span class="flex flex-col gap-2 text-sm">
        <b>Dein Standort</b>
        <span class="flex gap-1">
          <LocationIcon size={1.5} />
          <div class="flex flex-col text-xs">
            {#each address as addressItem}
              <i>{addressItem}</i>
            {/each}
          </div>
        </span>
      </span>
    </div>
    <div class="-mt-6 mr-14 flex flex-col">
      <div class="z-10 h-24 w-24">
        <ProfilePicture {imageUrl} />
      </div>
    </div>
  </div>
</div>
