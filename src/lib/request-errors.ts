export const usernameAlreadyExists: RequestError = {
  code: 1,
  message: "Der Benutzername wird bereits verwendet"
};

export const emailAlreadyExists: RequestError = {
  code: 2,
  message: "Die E-Mail wird bereits verwendet"
};

export const noLocationFound: RequestError = {
  code: 3,
  message: "Wir konnten deine Adresse leider nicht finden"
};

export const missingDealId: RequestError = {
  code: 4,
  message: "Für die Aktion wird eine Deal ID benötigt, es wurde jedoch keine mit geschickt"
};

export interface RequestError {
  code: number;
  message: string;
}
