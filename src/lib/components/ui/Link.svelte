<script lang="ts">
  export let href: string;
  export let hoverUnderline = false;
  const hoverEffect = hoverUnderline ? "hover:underline" : "hover:text-primary";
</script>

<a class={hoverEffect + " cursor-pointer"} {href}><slot /></a>
