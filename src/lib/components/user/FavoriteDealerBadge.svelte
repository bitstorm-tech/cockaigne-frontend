<script lang="ts">
  import HeartIcon from "$lib/components/ui/icons/HeartIcon.svelte";

  export let number = 0;
</script>

<span class="badge gap-2 text-[#69828c] bg-transparent border border-[#2c363a]">
  <HeartIcon size={0.8} />
  {number}
</span>
