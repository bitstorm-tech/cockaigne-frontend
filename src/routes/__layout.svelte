<script lang="ts">
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="flex flex-col h-screen">
  <Navbar />
  <div class="min-h-0 flex-grow">
    <slot />
  </div>
  <Footer />
</div>
