<script lang="ts">
  import Button from '../ui/Button.svelte';
  import Link from '../ui/Link.svelte';
</script>

<div class="flex flex-col space-y-2 justify-between">
  <Button type="submit">Registrieren</Button>
  <div class="flex space-x-1 text-xs">
    <span>Bereits registriert?</span>
    <Link href="/login">Anmelden</Link>
  </div>
</div>
