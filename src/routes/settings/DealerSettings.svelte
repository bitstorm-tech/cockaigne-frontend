<script lang="ts">
  import CategorySelect from "$lib/components/ui/CategorySelect.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import type { Account } from "$lib/database/account/account.model";
  import "leaflet/dist/leaflet.css";
  import AddressSettings from "./AddressSettings.svelte";

  export let account: Account;
  export let profileImageFile: File;

  let showTabIndex = 0;
</script>

<div class="tabs">
  <button on:click={() => (showTabIndex = 0)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 0}>
    Allgemein
  </button>
  <button on:click={() => (showTabIndex = 1)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 1}>
    Adresse
  </button>
  <button on:click={() => (showTabIndex = 2)} class="tab tab-bordered grow" class:tab-active={showTabIndex === 2}>
    Profilbild
  </button>
</div>
{#if showTabIndex === 0}
  <div class="flex flex-col gap-3">
    <Input label="Firmenname" bind:value={account.company_name} />
    <Input label="E-Mail" bind:value={account.email} disabled />
    <Input label="Telefonnummer" bind:value={account.phone} type="tel" />
    <Input label="Umsatzsteuer ID" bind:value={account.tax_id} />
    <CategorySelect label="Branche" bind:value={account.default_category} />
  </div>
{:else if showTabIndex === 1}
  <AddressSettings bind:account />
{:else}
  <MediaPicker imagePreview={account.profile_image} bind:file={profileImageFile} buttonText="Profilbild ändern" />
{/if}
