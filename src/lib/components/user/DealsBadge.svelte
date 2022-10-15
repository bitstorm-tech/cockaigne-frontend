<script lang="ts">
  import StarIcon from "$lib/components/ui/icons/StarIcon.svelte";

  export let number = 0;
</script>

<span class="badge gap-2 text-[#69828c] bg-transparent border border-[#2c363a]">
  <StarIcon size={0.8} />
  {number}
</span>
