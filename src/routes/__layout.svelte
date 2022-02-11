<script lang="ts">
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="h-screen relative">
  <div class="fixed top-0 max-h-fit w-screen">
    <Navbar />
  </div>
  <div class="container mx-auto pt-20 pb-14 h-full">
    <slot />
  </div>
  <div class="fixed bottom-0 max-h-fit w-screen">
    <Footer />
  </div>
</div>
