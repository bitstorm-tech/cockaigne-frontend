<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Account } from "$lib/database/account/account.model";
  import { POST } from "../../lib/http.service";

  const account = {} as Account;
  let openModal = false;
  let loading = false;

  $: disabled = account.email?.length === 0 || account.password?.length === 0;

  async function register() {
    loading = true;
    const response = await fetch("/api/accounts", POST(account));

    if (response.ok) {
      await invalidateAll();
      const id = await response.text();
      goto(account.dealer ? `/dealer/${id}` : "/user/").then();
    } else {
      openModal = true;
    }
    loading = false;
  }
</script>

<div class="flex flex-col gap-3 mx-auto mt-10 h-full w-5/6 lg:w-1/3">
  <h1>Registrieren</h1>
  <Checkbox label="Ich bin ein Dealer" bind:checked={account.dealer} />
  <Input label="E-Mail" type="email" bind:value={account.email} />
  {#if !account.dealer}
    <Input label="Benutzername" type="text" bind:value={account.username} />
  {/if}
  <Input label="Passwort" type="password" bind:value={account.password} />
  {#if account.dealer}
    <Input label="Firmenname" type="text" bind:value={account.company_name} />
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <Input label="Straße" type="text" bind:value={account.street} />
      </div>
      <Input label="Hausnummer" type="text" bind:value={account.house_number} />
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <Input label="Ort" type="text" bind:value={account.city} />
      </div>
      <Input label="PLZ" type="number" bind:value={account.zip} />
    </div>
    <Input label="Telefon" type="tel" bind:value={account.phone} />
  {/if}
  <Button on:click={register} {loading} {disabled}>Registrieren</Button>
  <span class="text-xs mt-6">Du hast schon einen Account? <Link href="/">Hier einloggen!</Link></span>
</div>
<Modal bind:open={openModal}>E-Mail wurde bereits registriert!</Modal>
