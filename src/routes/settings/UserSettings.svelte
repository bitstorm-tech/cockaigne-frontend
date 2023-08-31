<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import { logError } from "$lib/error-utils";
  import type { Account } from "$lib/supabase/public-types";

  export let account: Account;
  export let profileImageFile: File;

  let showTabIndex = 0;
  let showAlert = false;
  let showAlertEmailChanged = false;
  let loading = false;
  let editEmail = false;

  async function changePassword() {
    loading = true;
    const { error } = await $page.data.supabase.auth.resetPasswordForEmail(account.email, {
      redirectTo: "http://localhost:5173/password/reset"
    });

    if (error) {
      logError(error, "Can't reset password");
    }

    showAlert = true;
    loading = false;
  }

  async function changeEmail() {
    loading = true;
    const { error } = await $page.data.supabase.auth.updateUser({ email: account.email });

    if (error) {
      logError(error, "Can't change email");
    }

    showAlertEmailChanged = true;
    editEmail = false;
    loading = false;
  }

  async function notify() {
    await Notification.requestPermission();
    new Notification("Hallo Cockaigne User!");
  }
</script>

<div class="tabs">
  <button on:click={() => (showTabIndex = 0)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 0}>
    Allgemein
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 1}>
    Profilbild
  </button>
</div>

{#if showTabIndex === 0}
  <Input label="Benutzername" bind:value={account.username} />
  <div class="flex w-full items-end gap-2">
    <div class="w-full">
      <Input label="E-Mail" bind:value={account.email} disabled={!editEmail} />
    </div>
    {#if editEmail}
      <Button on:click={changeEmail}>Ändern</Button>
      <Button on:click={() => (editEmail = false)}>Abbrechen</Button>
    {/if}
  </div>
  <Button on:click={() => (editEmail = true)}>E-Mail ändern</Button>
  <Button on:click={changePassword} {loading}>Passwort ändern</Button>
  <!-- <Button on:click={notify}>Notification Test</Button> -->
{:else}
  <MediaPicker imagePreview={account.profileImageUrl} bind:file={profileImageFile} buttonText="Profilbild ändern" />
{/if}
<Alert bind:show={showAlert} warning={false}>
  Wir haben dir eine E-Mail mit einem Link zum ändern deines Passworts gesendet.
</Alert>
<Alert bind:show={showAlertEmailChanged} warning={false}>
  Wir haben dir eine E-Mail an deine alte und neue Adresse gesendet. Bitte bestätige beide um die Adresse zu ändern.
</Alert>
