<script>
  import HomeIcon from "$lib/components/ui/icons/HomeIcon.svelte";
  import MapIcon from "$lib/components/ui/icons/MapIcon.svelte";
  import TagIcon from "$lib/components/ui/icons/TagIcon.svelte";
</script>

<footer class="btm-nav btm-nav-sm bg-base-300 border-t-[0.01rem]">
  <a href="/">
    <HomeIcon />
  </a>
  <button>
    <TagIcon />
  </button>
  <a href="/map">
    <MapIcon />
  </a>
</footer>
