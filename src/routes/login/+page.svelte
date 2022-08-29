<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
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
      await invalidate(); // needed to update $page.data.user with actual user data
      const body = await response.json();

      if (body.isDealer) {
        goto("/dealer/" + body.id).then();
      } else {
        goto("/user/").then();
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
  <Input label="Password" type="password" bind:value={password} on:enter={login} />
  <Button on:click={login} {loading} {disabled}>Einloggen</Button>
  <span class="text-xs mt-6">Noch keinen Account? <Link href="/registration">Hier anmelden!</Link></span>
</div>
<Modal bind:open={openModal}>E-Mail und/oder Passwort falsch!</Modal>
