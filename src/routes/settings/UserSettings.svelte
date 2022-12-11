<script lang="ts">
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import type { Account } from "$lib/database/account/account.model";

  export let account: Account;
  export let profileImageFile: File;

  let showTabIndex = 0;
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
{:else}
  <MediaPicker imagePreview={account.profile_image} bind:file={profileImageFile} buttonText="Profilbild ändern" />
{/if}
