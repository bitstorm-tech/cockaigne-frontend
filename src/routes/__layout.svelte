<script lang="ts">
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<div class="sticky z-50 top-0 w-screen bg-base-300">
  <Navbar />
</div>
<slot />
