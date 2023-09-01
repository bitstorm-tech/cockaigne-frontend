<script lang="ts">
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import type { Account } from "$lib/supabase/public-types";
  import ChangeEmailForm from "./ChangeEmailForm.svelte";
  import ResetPasswordButton from "./ResetPasswordButton.svelte";

  export let account: Account;
  export let profileImageFile: File;

  let showTabIndex = 0;

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
  <ChangeEmailForm email={account.email} />
  <ResetPasswordButton email={account.email} />
  <!-- <Button on:click={notify}>Notification Test</Button> -->
{:else}
  <MediaPicker imagePreview={account.profileImageUrl} bind:file={profileImageFile} buttonText="Profilbild ändern" />
{/if}
