<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Link from "$lib/components/ui/Link.svelte";

  let dealer = true;
  let email = "";
  let password = "";

  $: disabled = email.length === 0 || password.length === 0;

  async function register() {
    const response = await fetch("/api/accounts", {
      method: "POST",
      body: JSON.stringify({ email, password, dealer })
    });

    if (response.ok) {
      await goto(dealer ? "/dealer" : "/user");
    }
  }
</script>

<div class="flex items-center justify-center mt-10 mb-32">
  <div class="w-5/6 lg:w-1/3 space-y-3">
    <h1>Bei Hotspots registrieren</h1>
    <Checkbox label="Ich bin ein Dealer" bind:checked={dealer} />
    <Input label="E-Mail" type="email" bind:value={email} />
    <Input label="Passwort" type="password" bind:value={password} />
    <div class="flex flex-col space-y-2">
      <Button on:click={register} {disabled}>Registrieren</Button>
      <div class="flex text-xs space-x-1">
        <span>Du hast schon Account?</span>
        <Link href="/">Hier einloggen!</Link>
      </div>
    </div>
  </div>
</div>
