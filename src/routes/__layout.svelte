<script lang="ts">
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="flex flex-col h-screen">
  <Navbar />
  <div class="min-h-0 mb-auto">
    <slot />
  </div>
  <Footer />
</div>
