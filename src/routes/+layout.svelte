<script lang="ts">
  import { page } from "$app/stores";
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import "../tailwind.css";
</script>

{#if $page.data.user.isAuthenticated}
  <Navbar />
{/if}
<div class="pb-6">
  <slot />
</div>
{#if $page.data.user.isAuthenticated}
  <Footer />
{/if}
