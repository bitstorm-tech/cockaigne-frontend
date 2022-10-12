<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import MediaPicker from "$lib/components/ui/MediaPicker.svelte";
  import WarningMessage from "$lib/components/ui/WarningMessage.svelte";
  import type { Account, AccountUpdateOptions } from "$lib/database/account/account.model";
  import { PUT } from "$lib/http.service";

  export let data;
  let account: Account = data.account;
  let newUsername = account.username;
  let newProfileImage: File;
  let errorMessage = "";

  $: disableSave = (newUsername.length === 0 || account.username === newUsername) && !newProfileImage;

  async function save() {
    await saveUsername();
    await saveProfileImage();
  }

  async function saveUsername() {
    if (newUsername.toLowerCase() === account.username.toLowerCase()) {
      return;
    }

    const updates: AccountUpdateOptions = {
      username: newUsername
    };

    let response = await fetch("/api/accounts", PUT(updates));

    if (!response.ok) {
      const error = await response.json();
      errorMessage = error.message;
      return;
    }

    account.username = newUsername;
  }

  async function saveProfileImage() {
    if (!newProfileImage) {
      return;
    }

    const formData = new FormData();
    formData.append("file", newProfileImage);
    const response = await fetch("/api/pictures/profile", { method: "post", body: formData });

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
    newUsername = account.username;
  }

  function onFileSelected(event: CustomEvent<File>) {
    newProfileImage = event.detail;
  }
</script>

<section class="flex flex-col p-10 gap-4">
  <Input label="Benutzername" bind:value={newUsername} />
  <MediaPicker imagePreview={account.profile_image} on:fileSelected={onFileSelected} buttonText="Profilbild wählen" />
  <div class="flex justify-between">
    <Button on:click={save} disabled={disableSave}>Speichern</Button>
    <a href="/"><Button outline>Abbrechen</Button></a>
  </div>
</section>
<WarningMessage show={errorMessage.length > 0} on:confirm={confirmError}>
  {errorMessage}
</WarningMessage>
