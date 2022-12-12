<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import WarningMessage from "$lib/components/ui/WarningMessage.svelte";
  import type { Account, AccountUpdateOptions } from "$lib/database/account/account.model";
  import { POST, PUT } from "$lib/http.service";
  import DealerSettings from "./DealerSettings.svelte";
  import UserSettings from "./UserSettings.svelte";

  export let data;
  let account: Account = data?.account;
  let newProfileImage: File | undefined;
  let errorMessage = "";
  let loading = false;

  const originalUsername = account.username;
  const isDealer = $page.data.user.isDealer;

  async function save() {
    loading = true;
    await saveAccount();
    await saveProfileImage();
    loading = false;
  }

  async function saveAccount() {
    const updates: AccountUpdateOptions = isDealer
      ? {
          company_name: account.company_name,
          tax_id: account.tax_id,
          phone: account.phone,
          street: account.street,
          house_number: account.house_number,
          city: account.city,
          zip: account.zip,
          default_category: account.default_category
        }
      : {
          username: account.username
        };

    let response = await fetch("/api/accounts", PUT(updates));

    if (!response.ok) {
      const error = await response.json();
      errorMessage = error.message;
      return;
    }
  }

  async function saveProfileImage() {
    if (!newProfileImage) {
      return;
    }

    const formData = new FormData();
    formData.append("file", newProfileImage);
    const response = await fetch("/api/images/profile", POST(formData));

    if (response.ok) {
      account.profile_image = await response.text();
      newProfileImage = undefined;
      return;
    }

    const error = await response.json();
    errorMessage = error.message;
  }

  function confirmError() {
    errorMessage = "";
    account.username = originalUsername;
  }
</script>

<section class="flex flex-col p-4 gap-4">
  {#if isDealer}
    <DealerSettings bind:account bind:profileImageFile={newProfileImage} />
  {:else}
    <UserSettings bind:account bind:profileImageFile={newProfileImage} />
  {/if}
  <div class="grid grid-cols-2 gap-4">
    <Button on:click={save} {loading}>Speichern</Button>
    <Button on:click={() => goto("/")}>Abbrechen</Button>
  </div>
</section>
<WarningMessage show={errorMessage.length > 0} on:confirm={confirmError}>
  {errorMessage}
</WarningMessage>
