<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { logError } from "$lib/error-utils";
  import ResetPasswordButton from "../../settings/ResetPasswordButton.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let password = "";
  let passwordTest = "";
  let email = "";
  let alert = "";
  let loading = false;

  $: emailValid = email.length > 0 && email.includes("@");

  async function setPassword() {
    loading = true;
    const { error } = await $page.data.supabase.auth.updateUser({
      password
    });

    if (error) {
      logError(error, "Can't update password");
      alert = "Das Passwort konnte nicht geändert werden.";
      loading = false;
      return;
    }

    goto("/");
  }
</script>

<section class="p-4">
  <h1 class="pb-10 text-center">Neues Passwort</h1>
  <div class="flex flex-col gap-4">
    {#if data.passwordResetCode}
      <Input type="password" label="Passwort" bind:value={password} />
      <Input type="password" label="Passwort wiederholen" bind:value={passwordTest} />
      <Button disabled={password.length === 0 || password !== passwordTest} on:click={setPassword} {loading}>
        Passwort übernehmen
      </Button>
    {:else}
      <Input type="email" label="E-Mail" bind:value={email} />
      <div class="grid grid-cols-2 gap-4 pt-6">
        <ResetPasswordButton {email} disabled={!emailValid} />
        <Button on:click={() => goto("/login")}>Abbrechen</Button>
      </div>
    {/if}
  </div>
</section>
<Alert show={alert.length > 0} on:confirm={() => (alert = "")} warning={false}>{alert}</Alert>
