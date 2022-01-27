<script lang="ts">
  import Footer from '$lib/components/nav/Footer.svelte';
  import Navbar from '$lib/components/nav/Navbar.svelte';
  import ProfileSettings from '$lib/components/profile/ProfileSettings.svelte';
  import '../tailwind.css';
</script>

<Navbar />
<main class="container mx-auto py-4 px-4 md:px-48">
  <slot />
</main>
