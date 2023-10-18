<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
</script>

<section>
  <span>
    Wenn du auf den Button 'Abo verwalten' klickst, kommst du auf die Seite unseres Zahlungspartners, auf der du:
  </span>
  <ul class="py-6">
    <li>... dein Abo verwalten kannst</li>
    <li>... deine Rechnungen einsehen kannst</li>
    <li>... deine Bank- oder Kreditkartendaten aktualliseiren kannst</li>
  </ul>
  <a target="_blank" href="https://billing.stripe.com/p/login/test_4gw9AKfJh5rw9QQeUU">
    <Button fullwidth>Abo verwalten</Button>
  </a>
</section>
