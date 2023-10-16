<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import CategorySelect from "$lib/components/ui/CategorySelect.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { register } from "$lib/supabase/account-service";

  let isDealer = false;
  let email: string;
  let password: string;
  let passwordRepeat: string;
  let username: string;
  let defaultCategory: number;
  let street: string;
  let houseNumber: string;
  let city: string;
  let zip: string;
  let phone: string;
  let taxId: string;
  let age: string;
  let gender: string;
  let loading = false;
  let errorMessage: string | null;

  const genderOptions = {
    m: "Mann",
    f: "Frau"
  };

  const ageOptions = {
    1: "Bis 18",
    2: "19-29",
    3: "30-39",
    4: "40-49",
    5: "50+"
  };

  $: disabled =
    email?.length === 0 ||
    password?.length === 0 ||
    password !== passwordRepeat ||
    username?.length === 0 ||
    (isDealer && !street) ||
    (isDealer && !houseNumber) ||
    (isDealer && !city) ||
    (isDealer && !zip) ||
    (isDealer && !phone) ||
    (!isDealer && !age) ||
    (!isDealer && !gender);

  async function handleRegistration() {
    loading = true;

    const error = await register($page.data.supabase, {
      email,
      password,
      isDealer,
      defaultCategory,
      street,
      houseNumber,
      city,
      zip,
      phone,
      username,
      age,
      gender,
      taxId
    });

    if (error) {
      errorMessage = error;
      loading = false;
      return;
    }

    goto(`/confirm/${email}`).then();
  }
</script>

<div class="mx-auto mt-10 flex h-full w-5/6 flex-col gap-3 lg:w-1/3">
  <h1>Registrieren</h1>
  <Checkbox label="Ich bin ein Dealer" bind:checked={isDealer} />
  <Input label="E-Mail" type="email" bind:value={email} />
  {#if !isDealer}
    <Input label="Benutzername" type="text" bind:value={username} />
  {/if}
  <div class="grid grid-cols-2 gap-3">
    <Input label="Passwort" type="password" bind:value={password} />
    <Input label="Passwort wiederholen" type="password" bind:value={passwordRepeat} />
  </div>
  {#if isDealer}
    <Input label="Firmenname" type="text" bind:value={username} />
    <CategorySelect label="Branche" bind:value={defaultCategory} />
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <Input label="Straße" type="text" bind:value={street} />
      </div>
      <Input label="Hausnummer" type="text" bind:value={houseNumber} />
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <Input label="Ort" type="text" bind:value={city} />
      </div>
      <Input label="PLZ" type="number" bind:value={zip} />
    </div>
    <Input label="Telefon" type="tel" bind:value={phone} />
    <Input label="Umsatzsteuer ID" type="text" bind:value={taxId} />
  {:else}
    <ButtonGroup label="Geschlecht" options={genderOptions} bind:value={gender} />
    <ButtonGroup label="Alter" options={ageOptions} bind:value={age} />
  {/if}
  <div class="grid grid-cols-2 gap-4 pt-6">
    <Button warning on:click={handleRegistration} {loading} {disabled}>Registrieren</Button>
    <Button on:click={() => goto("/")}>Abbrechen</Button>
  </div>
</div>
<Alert show={!!errorMessage} on:confirm={() => (errorMessage = null)}>{errorMessage}</Alert>
