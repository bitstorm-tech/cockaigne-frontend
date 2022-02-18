<script lang="ts">
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="w-screen">
  <Navbar />
</div>
<div class="h-[90vh]">
  <slot />
</div>
