<script lang="ts">
  import { goto } from '$app/navigation';
  import Input from '../ui/Input.svelte';
  import WarningMessage from '../ui/WarningMessage.svelte';
  import { createUser, getInvalidUserFormFields } from '$lib/user/user.service';
  import RegisterButton from './RegisterButton.svelte';

  let errorMessage: string;

  async function submit(event) {
    errorMessage = null;
    const form = event.target;
    const invalidFields = getInvalidUserFormFields(form);

    if (invalidFields.length > 0) {
      errorMessage = 'Folgende Eingabefelder sind nicht korrekt: ' + invalidFields.join(', ');
      return;
    }

    const response = await createUser(form.email.value, form.password.value);
    if (response.ok) {
      goto('/');
    } else {
      errorMessage = 'Leider ist bei der Registrierung etwas schief gegangen :(';
    }
  }
</script>

<form class="flex flex-col space-y-4" on:submit|preventDefault={submit}>
  <WarningMessage show={!!errorMessage}>{errorMessage}</WarningMessage>
  <Input label="E-Mail" id="email" type="email" />
  <Input label="Passwort" id="password" type="password" />
  <RegisterButton />
</form>
