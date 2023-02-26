<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import type { Account } from "$lib/database/account/account.model";
  import { fileToBase64 } from "$lib/file.utils";
  import { POST } from "$lib/http.utils";
  import accountService from "$lib/supabase/account-service";
  import type { AccountUpdate } from "$lib/supabase/public-types";
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
    const updates: AccountUpdate = isDealer
      ? {
          username: account.username,
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

    const error = await accountService.updateAccount(updates);

    if (error) {
      errorMessage = error;
    }
  }

  async function saveProfileImage() {
    if (!newProfileImage) {
      return;
    }

    const base64 = (await fileToBase64(newProfileImage)) as string;
    const response = await fetch("/api/images/profile", POST({ base64 }));

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

<section class="flex flex-col gap-4 p-4">
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
<Alert show={errorMessage.length > 0} on:confirm={confirmError}>
  {errorMessage}
</Alert>
