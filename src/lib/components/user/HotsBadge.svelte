<script lang="ts">
  import BookmarkCounterIcon from "$lib/components/ui/icons/BookmarkCounterIcon.svelte";

  export let number = 0;
</script>

<span class="badge gap-2 border border-[#2c363a] bg-transparent text-[#69828c]">
  <BookmarkCounterIcon size={0.8} />
  {number}
</span>
