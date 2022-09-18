<script lang="ts">
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import type { Rating } from "../../database/rating/rating.model";

  export let rating: Rating;

  function randomNumber() {
    return Math.random() * Math.random() * 1000000;
  }
</script>

<div class="flex flex-col">
  <div class="flex justify-between bg-base-200 py-2 border-y border-base-300 pl-20 pr-4">
    <div class="h-12 w-12 absolute left-4">
      <ProfilePicture imageUrl="https://api.lorem.space/image/face?hash={randomNumber()}" />
    </div>
    <div>Name</div>
    <RatingStars stars={rating.stars} showLabel={false} disabled={true} />
  </div>
  <div class="p-2 bg-base-100 text-xs pt-6">
    {rating.rating_text}
  </div>
</div>
