<script lang="ts">
  import { companyFormToObject, getInvalidCompanyFormFields } from '$lib/company/company.service';
  import { post } from '$lib/http.service';
  import Input from '../ui/Input.svelte';
  import WarningMessage from '../ui/WarningMessage.svelte';
  import RegisterButton from './RegisterButton.svelte';

  let errorMessage: string;
  let scrollY: number;

  async function submit(event) {
    const form = event.target;
    const invalidFields = getInvalidCompanyFormFields(form);
    if (invalidFields.length > 0) {
      errorMessage = 'Folgende Eingabefelder sind nicht korrekt: ' + invalidFields.join(', ');
      scrollY = 0;
      return;
    }

    const company = companyFormToObject(form);
    const response = await post('/api/companies', company);

    if (response.ok) {
      alert('Registrierung war erfolgreich!');
    } else {
      errorMessage = 'Leider ist bei der Registrierung etwas schief gegangen :(';
      scrollY = 0;
    }
  }
</script>

<svelte:window bind:scrollY />

<form on:submit|preventDefault={submit} class="flex flex-col space-y-4">
  <WarningMessage show={!!errorMessage}>{errorMessage}</WarningMessage>
  <Input label="E-Mail" id="email" type="email" />
  <Input label="Passwort" id="password" type="password" />
  <br />
  <Input label="Firmenname" id="name" type="text" />
  <Input label="Straße und Hausnummer" id="street" type="text" />
  <div class="flex space-x-4">
    <Input label="Stadt" id="city" type="text" />
    <Input label="PLZ" id="zip" type="text" />
  </div>
  <Input label="Ansprechperson" id="contact" type="text" />
  <Input label="Telefonnummer" id="phone" type="tel" />
  <Input label="USt ID (optional)" id="taxid" type="text" />
  <RegisterButton />
</form>
