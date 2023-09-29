<script lang="ts">
  import HeartCounterIcon from "$lib/components/ui/icons/HeartCounterIcon.svelte";

  export let number = 0;
</script>

<span class="badge gap-2 border border-[#2c363a] bg-transparent text-[#69828c]">
  <HeartCounterIcon size={0.8} />
  {number}
</span>
