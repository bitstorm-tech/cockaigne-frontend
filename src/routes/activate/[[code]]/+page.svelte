<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let email = "";

  function sendEmail() {
    fetch("/api/accounts/resend-activation-email", {
      method: "post",
      body: email
    });
  }
</script>

<section class="m-4 flex flex-col items-center">
  <h1 class="pb-8">Aktiviere deinen Account!</h1>
  {#if data.activationFailed}
    <div class="flex flex-col gap-3">
      <span>Leider ist bei der Aktivierung etwas schief gelaufen :(</span>
      <span>
        Kontaktiere bitte unseren Support:
        <a class="link" href="mailto:support@cockaigne.store">support@cockaigne.store</a>
      </span>
    </div>
  {:else if data.noActivationCode}
    <div class="flex flex-col gap-3">
      <span>Bevor du weiter machen kannst, musst du erst noch deinen Account aktivieren.</span>
      <span>Hierfür haben wir dir eine E-Mail mit dem Aktivierungs-Code geschickt.</span>
      <span>Falls du die E-Mail nicht finden kannst, schaue bitte auch mal in deinem Spam-Ordner nach.</span>
      <span>
        Sollte sie dort auch nicht sein, kannst du dir entweder unten eine neue senden lassen oder du kontaktierst uns
        unter <a class="link" href="mailto:support@cockaigne.store">support@cockaigne.store</a>.
      </span>
      <div class="m-8 flex flex-col gap-3">
        <Input label="E-Mail" bind:value={email} />
        <Button on:click={sendEmail}>Aktivierungs-Code senden</Button>
      </div>
      <a class="link text-center" href="/">Zurück zur Startseite</a>
    </div>
  {/if}
</section>
