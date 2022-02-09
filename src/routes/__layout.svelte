<script lang="ts">
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<!--<div class="grid grid-rows-3 auto-rows-auto h-screen">-->
<div class="sticky top-0 max-h-fit">
  <Navbar />
</div>
<div class="container mx-auto">
  <slot />
</div>
<div class="sticky bottom-0 max-h-fit">
  <Footer />
</div>
<!--</div>-->
