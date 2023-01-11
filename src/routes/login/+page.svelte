<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

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
      await invalidateAll(); // needed to update $page.data.user with actual user data
      const body = await response.json();

      if (body.dealer) {
        goto("/dealer/" + body.id).then();
      } else {
        goto("/user/").then();
      }
    } else {
      const body = await response.json();
      if (body.code === 7) {
        goto("/activate");
      }
      openModal = true;
      loading = false;
    }
  }
</script>

<div class="mx-auto mt-10 flex h-full w-5/6 flex-col gap-3 lg:w-1/3">
  <h1>Einloggen</h1>
  <Input label="E-Mail" type="email" bind:value={email} />
  <Input label="Password" type="password" bind:value={password} on:enter={login} />
  <Button on:click={login} {loading} {disabled}>Einloggen</Button>
  <span class="mt-6 text-xs">Noch keinen Account? <Link href="/registration">Hier anmelden!</Link></span>
</div>
<Modal bind:open={openModal}>E-Mail und/oder Passwort falsch!</Modal>
