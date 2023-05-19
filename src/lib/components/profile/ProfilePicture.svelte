<script>
  import { menuOpen } from "$lib/stores/navigation.store";

  export let imageUrl = "";
  export let size = 6;
  const style = `width: ${size}rem; height: ${size}rem`;
</script>

<div class="avatar z-50 cursor-pointer" class:invisible={$menuOpen}>
  <div class="rounded-full ring-2 ring-[#556368]" {style}>
    <img src={imageUrl} alt="Profile" />
  </div>
</div>
