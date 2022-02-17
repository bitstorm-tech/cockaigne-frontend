<script lang="ts">
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="flex flex-col place-items-start h-screen">
  <div class="w-screen">
    <Navbar />
  </div>
  <div class="container mx-auto max-h-[calc(100%-4rem)]">
    <slot />
  </div>
</div>
