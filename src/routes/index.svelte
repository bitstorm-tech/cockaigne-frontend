<script>
  import Button from "$lib/components/ui/Button.svelte";
  import Link from "$lib/components/ui/Link.svelte";
  import Input from "$lib/components/ui/Input.svelte";

  let email = "";
  let password = "";

  $: disabled = email.length === 0 || password.length === 0;

  function login() {
    alert(email + password);
  }
</script>

<div class="flex flex-col gap-3 mx-auto mt-10 h-full w-5/6 lg:w-1/3">
  <h1>Einloggen</h1>
  <Input label="E-Mail" bind:value={email} />
  <Input label="Password" bind:value={password} />
  <Button on:click={login} {disabled}>Einloggen</Button>
  <span class="text-xs mt-6">Noch keinen Account? <Link href="/registration">Hier anmelden!</Link></span>
</div>
