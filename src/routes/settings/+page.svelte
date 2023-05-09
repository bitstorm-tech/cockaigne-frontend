<script lang="ts">
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { updateAccount } from "$lib/supabase/account-service";
  import type { Account, AccountUpdate } from "$lib/supabase/public-types";
  import { saveProfileImage } from "$lib/supabase/storage-service";
  import DealerSettings from "./DealerSettings.svelte";
  import UserSettings from "./UserSettings.svelte";

  export let data;
  let account: Account = data.account;
  let newProfileImage: File | undefined;
  let errorMessage = "";
  let loading = false;

  const originalUsername = account.username;
  const isDealer = data.session?.user.user_metadata.isDealer;

  async function save() {
    loading = true;
    await saveAccount();
    await saveImage();
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

    updates.id = data.session?.user.id;
    const error = await updateAccount(data.supabase, updates);

    if (error) {
      errorMessage = error;
    }
  }

  async function saveImage() {
    if (!newProfileImage) {
      return;
    }

    const profileImageUrl = await saveProfileImage(data.supabase, account.id, newProfileImage);

    if (profileImageUrl) {
      account.profileImageUrl = profileImageUrl;
      newProfileImage = undefined;
      return;
    }

    errorMessage = "Kann Profilbild gerade nicht speichern";
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
