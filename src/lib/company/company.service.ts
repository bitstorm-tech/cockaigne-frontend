import type { Company } from './company.model';

export function getInvalidCompanyFormFields(form): string[] {
  const invalidFields: string[] = [];

  validate(form.email, 'E-Mail', invalidFields);
  validate(form.password, 'Passwort', invalidFields);
  validate(form.name, 'Firmenname', invalidFields);
  validate(form.street, 'Straße und Hausnummer', invalidFields);
  validate(form.city, 'Stadt', invalidFields);
  validate(form.zip, 'PLZ', invalidFields);
  validate(form.contact, 'Ansprechpartner', invalidFields);
  validate(form.phone, 'Telefonnummer', invalidFields);

  return invalidFields;
}

export function companyFormToObject(form): Company {
  return {
    email: form.email.value,
    password: form.password.value,
    name: form.name.value,
    street: form.street.value,
    city: form.city.value,
    zip: form.zip.value,
    contactPerson: form.contact.value,
    phone: form.phone.value,
    taxId: form.taxid.value
  };
}

function validate(field, fieldName: string, invalidFieldsArray: string[]): void {
  if (field.value.length === 0) {
    invalidFieldsArray.push(fieldName);
  }
}
