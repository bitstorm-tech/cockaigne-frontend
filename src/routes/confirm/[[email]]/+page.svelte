<script lang="ts">
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { supabase, translateError } from "$lib/supabase/supabase-client";
  import type { PageData } from "./$types";

  export let data: PageData;
  let code: string;
  let email = data.email;
  let errorMessage: string | null;
  let loading = false;

  async function confirm() {
    loading = true;
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup"
    });

    if (error) {
      errorMessage = translateError(error);
      loading = false;
      return;
    }

    goto("/").then();
  }
</script>

<section class="flex flex-col gap-8 p-6">
  <h1>Aktiviere deinen Account!</h1>
  <p>Wir haben dir an deine E-Mail einen Aktivierungscode geschickt. Gib diesen bitte hier ein:</p>
  <Input label="Deine E-Mail" bind:value={email} />
  <Input label="Aktivierungscode" centerText letterSpacing bind:value={code} maxlength={6} />
  <div class="grid grid-cols-2 gap-4 pt-6">
    <Button disabled={code?.length < 6 || email.length === 0} {loading} on:click={confirm}>Aktivieren</Button>
    <Button on:click={() => goto("/")}>Abbrechen</Button>
  </div>
</section>
<Alert show={!!errorMessage} on:confirm={() => (errorMessage = null)}>{errorMessage}</Alert>
