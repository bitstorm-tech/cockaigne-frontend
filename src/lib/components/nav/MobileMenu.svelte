<script>
  import HomeIcon from "$lib/components/ui/icons/HomeIcon.svelte";
  import TagIcon from "$lib/components/ui/icons/TagIcon.svelte";
  import MapIcon from "$lib/components/ui/icons/MapIcon.svelte";
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";
</script>

<div class="bg-primary flex flex-col gap-8 p-2 z-50">
  <a href="/" class="h-8 flex items-center gap-3"><HomeIcon /> Home</a>
  <a href="/privacy" class="h-8 flex items-center gap-3"><TagIcon /> Schnäppchen</a>
  <a href="/map" class="h-8 flex items-center gap-3"><MapIcon /> Umgebungskarte</a>
  <a href="/test" class="h-8 flex items-center gap-3"><FireIcon /> Test</a>
</div>
