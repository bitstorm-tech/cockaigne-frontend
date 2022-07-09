<script>
  import AddPictureButton from "$lib/components/pictures/AddPictureButton.svelte";
</script>

<div class="flex flex-wrap">
  {#each Array(9) as _, i}
    <div class="p-0.5 w-1/3">
      <img class="h-60 object-cover" src={`/images/dummy/u${i + 1}_div.png`} alt="Dealer picture" />
    </div>
  {/each}
</div>
<div class="sticky bottom-3 pr-3 w-full flex justify-end">
  <AddPictureButton />
</div>
