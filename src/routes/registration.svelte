<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  let dealer = true;
  let email = "";
  let password = "";
  let openModal = false;

  $: disabled = email.length === 0 || password.length === 0;

  async function register() {
    const response = await fetch("/api/accounts", {
      method: "post",
      body: JSON.stringify({ email, password, dealer })
    });

    if (response.ok) {
      await goto(dealer ? "/dealer" : "/user");
    } else {
      openModal = true;
    }
  }
</script>

<div class="flex flex-col gap-3 mx-auto mt-10 h-full w-5/6 lg:w-1/3">
  <h1>Registrieren</h1>
  <Checkbox label="Ich bin ein Dealer" bind:checked={dealer} />
  <Input label="E-Mail" type="email" bind:value={email} />
  <Input label="Passwort" type="password" bind:value={password} />
  <Button on:click={register} {disabled}>Registrieren</Button>
  <span class="text-xs mt-6">Du hast schon einen Account? <Link href="/">Hier einloggen!</Link></span>
</div>
<Modal open={openModal} on:close={() => (openModal = false)}>E-Mail wurde bereits registriert!</Modal>
