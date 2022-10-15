<script lang="ts">
  import FireIcon from "$lib/components/ui/icons/FireIcon.svelte";

  export let number = 0;
</script>

<span class="badge gap-2 text-[#69828c] bg-transparent border border-[#2c363a]">
  <FireIcon size={0.8} />
  {number}
</span>
