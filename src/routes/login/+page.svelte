<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import type { RequestError } from "$lib/request-errors";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  $: disabled = email.length === 0 || password.length === 0;

  async function login() {
    loading = true;
    const response = await fetch("/api/login", {
      method: "post",
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      await invalidateAll(); // needed to update $page.data.user with actual user data
      const body = await response.json();

      if (body.dealer) {
        goto("/dealer/" + body.id).then();
      } else {
        goto("/user/").then();
      }
    } else {
      if (response.status === 403) {
        errorMessage = "E-Mail und/oder Passwort falsch!";
        loading = false;
        return;
      }

      const error: RequestError = await response.json();
      if (error.code === 7) {
        goto("/activate");
      }
      errorMessage = error.message;
    }
  }
</script>

<div class="mx-auto mt-10 flex h-full w-5/6 flex-col gap-3 lg:w-1/3">
  <h1>Einloggen</h1>
  <Input label="E-Mail" type="email" bind:value={email} />
  <Input label="Password" type="password" bind:value={password} on:enter={login} />
  <Button on:click={login} {loading} {disabled}>Einloggen</Button>
  <p class="mt-6 text-center text-xs">
    Noch keinen Account?
    <Link href="/registration">Hier anmelden!</Link>
  </p>
  <p class="text-center text-xs">
    Passwort vergessen?
    <Link href="/password">Klicke hier</Link>
  </p>
</div>
<Alert show={errorMessage.length > 0} on:confirm={() => (errorMessage = "")}>{errorMessage}</Alert>
