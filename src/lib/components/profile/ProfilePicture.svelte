<script>
  export let imageUrl = "";
  export let size = 6;
  const style = `width: ${size}rem; height: ${size}rem`;
</script>

<div class="avatar cursor-pointer">
  <div class="rounded-full ring-2 ring-primary ring-[#556368]" {style}>
    <img src={imageUrl} alt="Profile" />
  </div>
</div>
