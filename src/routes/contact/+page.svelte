<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { saveContactMessage } from "$lib/supabase/contact-service";

  let message = "";
  let showAlert = false;
  let showSuccess = false;

  async function save() {
    const success = await saveContactMessage($page.data.supabase, $page.data.userId!, message);

    showAlert = !success;
    showSuccess = success;
  }
</script>

<section class="flex flex-col gap-4 p-4">
  <span>
    Hast du Fragen, Anmerkungen oder Lob? Oder willst du sonst etwas los werden? Schreib uns gerne eine Narchricht!
  </span>
  <Textarea label="Nachricht ({message.length} / 1000)" bind:value={message} lines={10}></Textarea>
  <Button disabled={message.length === 0} on:click={save}>Absenden</Button>
</section>
<Alert show={showAlert} on:confirm={() => (showAlert = false)}>
  <section class="flex flex-col gap-2 text-start">
    <span>Leider ist beim speichern deiner Nachricht etwas schief gegangen 😥</span>
    <span>Bitte versuche es später noch einmal!</span>
  </section>
</Alert>
<Alert show={showSuccess} warning={false} on:confirm={() => goto("/")}>
  <section class="flex flex-col gap-2 text-start">
    <span>Wir haben deine Nachricht erhalten 🥳</span>
    <span>Vielen Dank dafür!</span>
  </section>
</Alert>
