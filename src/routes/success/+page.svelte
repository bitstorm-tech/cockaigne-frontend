<script lang="ts">
  import Link from "$lib/components/ui/Link.svelte";

  export let data;
</script>

<section class="p-4">
  <h1>Glückwunsch zum Abo!</h1>
  <div class="flex flex-col items-center gap-10 py-4">
    <span>
      Wir freuen uns, dass du dich für das Abo {data.subscriptionName} entschieden hast. Lege gleich los und erstelle einen
      neuen Deal!
    </span>
    <Link href="/deals/new" underline>Neuen Deal erstellen</Link>
  </div>
</section>
