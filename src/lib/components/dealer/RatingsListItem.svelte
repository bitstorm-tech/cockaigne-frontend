<script>
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";

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
    <div>4 / 5</div>
  </div>
  <div class="p-2 bg-base-100 text-xs pt-6">
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
    magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
  </div>
</div>
