<script lang="ts">
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

<Navbar />
<div class="pb-6">
  <slot />
</div>
