<script>
  import Input from "$lib/components/ui/Input.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import { session } from "$app/stores";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let openModal = false;
  let loading = false;

  $: disabled = email.length === 0 || password.length === 0;

  async function login() {
    loading = true;
    const response = await fetch("/api/login", {
      method: "post",
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const body = await response.json();
      $session; // workaround: if this is the first page loaded, we need to do an initial subscribe to the session
      session.update(() => {
        return {
          isAuthenticated: true,
          isDealer: body.dealer
        };
      });

      if (body.dealer) {
        await goto("/dealer");
      } else {
        await goto("/user");
      }
    } else {
      openModal = true;
      loading = false;
    }
  }
</script>

<div class="flex flex-col gap-3 mx-auto mt-10 h-full w-5/6 lg:w-1/3">
  <h1>Einloggen</h1>
  <Input label="E-Mail" type="email" bind:value={email} />
  <Input label="Password" type="password" bind:value={password} />
  <Button on:click={login} {loading} {disabled}>Einloggen</Button>
  <span class="text-xs mt-6">Noch keinen Account? <Link href="/registration">Hier anmelden!</Link></span>
</div>
<Modal open={openModal} on:close={() => (openModal = false)}>E-Mail und/oder Passwort falsch!</Modal>
