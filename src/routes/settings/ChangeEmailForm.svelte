<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { logError } from "$lib/error-utils";

  export let email: string;

  let editEmail = false;
  let loading = false;
  let showAlert = false;

  async function changeEmail() {
    loading = true;
    const { error } = await $page.data.supabase.auth.updateUser({ email });

    if (error) {
      logError(error, "Can't change email");
    }

    showAlert = true;
    editEmail = false;
    loading = false;
  }
</script>

<div class="flex w-full items-end gap-2">
  <div class="w-full">
    <Input label="E-Mail" bind:value={email} disabled={!editEmail} />
  </div>
  {#if editEmail}
    <Button on:click={changeEmail}>Ändern</Button>
    <Button on:click={() => (editEmail = false)}>Abbrechen</Button>
  {/if}
</div>
<Button on:click={() => (editEmail = true)}>E-Mail ändern</Button>

<Alert bind:show={showAlert} warning={false}>
  Wir haben dir eine E-Mail an deine alte und neue Adresse gesendet. Bitte bestätige beide um die Adresse zu ändern.
</Alert>
