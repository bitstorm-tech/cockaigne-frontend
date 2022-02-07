<script lang="ts">
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="grid grid-row-3 h-screen">
  <div class="self-start">
    <Navbar />
  </div>
  <div class="min-h-0">
    <slot />
  </div>
  <div class="self-end">
    <Footer />
  </div>
</div>
