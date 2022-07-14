<script lang="ts">
  export let href: string;
  export let hoverUnderline = false;
  export let underline = false;
  const hoverEffect = hoverUnderline ? "hover:underline" : "hover:text-primary";
</script>

<a class={hoverEffect + " cursor-pointer"} class:underline {href}><slot /></a>
