<script lang="ts">
  import BookmarkIcon from '$lib/components/ui/icons/BookmarkIcon.svelte';

  export let number = 0;
</script>

<span class="badge gap-2 text-[#69828c] bg-transparent border border-[#2c363a]">
  <BookmarkIcon size={0.8} />
  {number}
</span>
