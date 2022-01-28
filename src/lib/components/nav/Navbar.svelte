<script lang="ts">
  import FireIcon from "$lib/components/icons/FireIcon.svelte";
  import MapIcon from "$lib/components/icons/MapIcon.svelte";
  import TagIcon from "$lib/components/icons/TagIcon.svelte";
  import ProfilePicture from "$lib/components/profile/ProfilePicture.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Link from "$lib/components/ui/Link.svelte";
</script>

<nav class="flex bg-primary justify-between py-2 px-4 md:px-52 items-center">
  <Link href="/" hoverUnderline>
    <div class="flex items-center text-xl gap-2">
      <FireIcon size={10} />
      Hotspots
    </div>
  </Link>
  <div class="flex gap-4 items-center">
    <Button small>
      <TagIcon />
    </Button>
    <Button small href="/map">
      <MapIcon />
    </Button>
    <div class="w-12 h-12">
      <ProfilePicture />
    </div>
  </div>
</nav>
