<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "../../lib/components/ui/Button.svelte";
  import Checkbox from "../../lib/components/ui/Checkbox.svelte";
  import Input from "../../lib/components/ui/Input.svelte";
  import Link from "../../lib/components/ui/Link.svelte";
  import Modal from "../../lib/components/ui/Modal.svelte";
  import type { Account } from "../../lib/database/account/account.model";

  const account = {} as Account;
  let openModal = false;

  $: disabled = account.email?.length === 0 || account.password?.length === 0;

  async function register() {
    const response = await fetch("/api/accounts", {
      method: "post",
      body: JSON.stringify(account)
    });

    if (response.ok) {
      const id = await response.text();
      goto(account.dealer ? `/dealer/${id}` : `/user/${id}`).then();
    } else {
      openModal = true;
    }
  }
</script>

<div class="flex flex-col gap-3 mx-auto mt-10 h-full w-5/6 lg:w-1/3">
  <h1>Registrieren</h1>
  <Checkbox label="Ich bin ein Dealer" bind:checked={account.dealer} />
  <Input label="E-Mail" type="email" bind:value={account.email} />
  <Input label="Passwort" type="password" bind:value={account.password} />
  {#if account.dealer}
    <Input label="Firmenname" type="text" bind:value={account.companyName} />
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <Input label="Straße" type="text" bind:value={account.street} />
      </div>
      <Input label="Hausnummer" type="text" bind:value={account.houseNumber} />
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <Input label="Ort" type="text" bind:value={account.city} />
      </div>
      <Input label="PLZ" type="number" bind:value={account.zip} />
    </div>
    <Input label="Telefon" type="tel" bind:value={account.phone} />
  {/if}
  <Button on:click={register} {disabled}>Registrieren</Button>
  <span class="text-xs mt-6">Du hast schon einen Account? <Link href="/static">Hier einloggen!</Link></span>
</div>
<Modal bind:open={openModal}>E-Mail wurde bereits registriert!</Modal>
