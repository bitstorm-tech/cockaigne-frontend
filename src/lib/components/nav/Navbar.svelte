<script lang="ts">
  import HamburgerIcon from '../icons/HamburgerIcon.svelte';
  import Link from '../ui/Link.svelte';
</script>

<nav class="flex bg-primary place-content-between p-4 text-white">
  <Link href="/" hoverUnderline>CITIRIZA</Link>
  <div class="flex space-x-3">
    <!-- <Link href="/campaign" hoverUnderline>Kampagnie erstellen</Link>
    <span>|</span> -->
    <Link href="/login" hoverUnderline>LOGIN</Link>
    <HamburgerIcon />
  </div>
</nav>
