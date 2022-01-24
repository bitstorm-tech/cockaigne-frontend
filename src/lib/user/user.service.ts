export function getInvalidUserFormFields(form): string[] {
  const invalidFields: string[] = [];

  if (form.email.value.length === 0) {
    invalidFields.push('E-Mail');
  }

  if (form.password.value.length === 0) {
    invalidFields.push('Passwort');
  }

  return invalidFields;
}
