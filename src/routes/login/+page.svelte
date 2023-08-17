<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Link from '$lib/components/ui/Link.svelte';
  import { login } from '$lib/supabase/auth';

  let email: string;
  let password: string;
  let errorMessage: string | null;
  let loading = false;

  $: disabled = email?.length === 0 || password?.length === 0;

  async function handleLogin() {
    loading = true;

    const error = await login($page.data.supabase, email, password);

    if (error) {
      errorMessage = error;
      loading = false;
      return;
    }

    goto("/").then();
  }
</script>

<div class="mx-auto mt-10 flex h-full w-5/6 flex-col gap-3 lg:w-1/3">
  <h1>Einloggen</h1>
  <Input label="E-Mail" type="email" bind:value={email} />
  <Input label="Password" type="password" bind:value={password} on:enter={handleLogin} />
  <div class="grid grid-cols-2 gap-2">
    <Button warning on:click={handleLogin} {loading} {disabled}>Einloggen</Button>
    <a href="/"><Button fullwidth>Zurück</Button></a>
  </div>
  <span class="pt-10 text-center text-sm">
    <Link href="/registration">Registrieren</Link> // <Link href="/password">Passwort vergessen</Link> // <Link
      href={`/confirm/${email}`}>Account aktivieren</Link
    >
  </span>
</div>
<Alert show={!!errorMessage} on:confirm={() => (errorMessage = null)}>{errorMessage}</Alert>
