<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import type { Account } from "$lib/database/account/account.model";
  import Alert from "$lib/components/ui/Alert.svelte";

  export let account: Account;
  export let profileImageFile: File;

  let showTabIndex = 0;
  let showAlert = false;
  let loading = false;

  async function changePassword() {
    loading = true;
    await fetch("/api/accounts/reset-password");
    showAlert = true;
    loading = false;
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
  <Input label="E-Mail" bind:value={account.email} disabled />
  <Button on:click={changePassword} {loading}>Passwort ändern</Button>
{:else}
  <MediaPicker imagePreview={account.profile_image} bind:file={profileImageFile} buttonText="Profilbild ändern" />
{/if}
<Alert bind:show={showAlert} warning={false}>
  Wir haben dir eine E-Mail mit einem Link zum ändern deines Passworts gesendet.
</Alert>
