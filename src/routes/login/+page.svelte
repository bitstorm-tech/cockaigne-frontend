<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import { supabase, translateError } from "$lib/supabase";

  let email: string;
  let password: string;
  let errorMessage: string | null;
  let loading = false;

  $: disabled = email?.length === 0 || password?.length === 0;

  async function login() {
    loading = true;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      errorMessage = translateError(error);
      loading = false;
      return;
    }

    await invalidateAll(); // needed to update $page.data.user with actual user data
    goto("/").then();
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
  <p class="text-center text-xs">
    Account noch nicht aktiviert?
    <Link href={`/confirm/${email}`}>Klicke hier</Link>
  </p>
</div>
<Alert show={!!errorMessage} on:confirm={() => (errorMessage = null)}>{errorMessage}</Alert>
