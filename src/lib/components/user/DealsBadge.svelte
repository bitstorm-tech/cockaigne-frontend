<script lang="ts">
  import DealCounterIcon from "$lib/components/ui/icons/DealCounterIcon.svelte";

  export let number = 0;
</script>

<span class="badge gap-2 border border-[#2c363a] bg-transparent text-[#69828c]">
  <DealCounterIcon size={0.8} />
  {number}
</span>
