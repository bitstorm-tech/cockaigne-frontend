<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { logError } from "$lib/error-utils";

  export let email: string;

  let loading = false;
  let showAlert = false;

  const redirectTo = `${window.location.protocol}//${window.location.host}/password/reset`;

  async function changePassword() {
    loading = true;
    const { error } = await $page.data.supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });

    if (error) {
      logError(error, "Can't reset password");
    }

    showAlert = true;
    loading = false;
  }
</script>

<Button on:click={changePassword} {loading}>Passwort ändern</Button>

<Alert bind:show={showAlert} warning={false}>
  Wir haben dir eine E-Mail mit einem Link zum ändern deines Passworts gesendet.
</Alert>
