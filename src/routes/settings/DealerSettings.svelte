<script lang="ts">
  import CategorySelect from "$lib/components/ui/CategorySelect.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import type { Account } from "$lib/supabase/public-types";
  import AddressSettings from "./AddressSettings.svelte";

  export let account: Account;
  export let profileImageFile: File;

  let showTabIndex = 0;
</script>

<div class="tabs">
  <button on:click={() => (showTabIndex = 0)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 0}>
    Allgemein
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 1}>
    Adresse
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 2}>
    Profilbild
  </button>
  <button on:click={() => (showTabIndex = 3)} class="tab-bordered tab grow" class:tab-active={showTabIndex === 3}>
    Rechnungen
  </button>
</div>
{#if showTabIndex === 0}
  <div class="flex flex-col gap-3">
    <Input label="Firmenname" bind:value={account.username} />
    <Input label="E-Mail" bind:value={account.email} disabled />
    <Input label="Telefonnummer" bind:value={account.phone} type="tel" />
    <Input label="Umsatzsteuer ID" bind:value={account.tax_id} />
    <CategorySelect label="Branche" bind:value={account.default_category} />
  </div>
{:else if showTabIndex === 1}
  <AddressSettings bind:account />
{:else if showTabIndex === 2}
  <MediaPicker imagePreview={account.profileImageUrl} bind:file={profileImageFile} buttonText="Profilbild ändern" />
{:else}
  <div>Rechungen</div>
{/if}
