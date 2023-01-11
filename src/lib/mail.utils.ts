const MAILERSEND_API_KEY = process.env.MAILERSEND_API_TOKEN || "";
const MAILERSEND_APU_URL = process.env.MAILERSEND_API_URL || "";
const MAILERSEND_VERIFICATION_TEMPLATE_ID = process.env.MAILERSEND_VERIFICATION_TEMPLATE_ID || "";
const COCKAIGNE_BASE_URL = process.env.COCKAIGNE_BASE_URL || "";

function createRequest(name: string, email: string, activationCode: string): RequestInit {
  const BODY = {
    from: {
      email: "welcome@cockaigne.store",
      name: "Cockaigne"
    },
    to: [
      {
        email
      }
    ],
    subject: "Willkommen bei Cockaigne!",
    template_id: MAILERSEND_VERIFICATION_TEMPLATE_ID,
    variables: [
      {
        email,
        substitutions: [
          {
            var: "name",
            value: name
          },
          {
            var: "activationUrl",
            value: `${COCKAIGNE_BASE_URL}/activate/${activationCode}`
          }
        ]
      }
    ]
  };

  return {
    method: "post",
    headers: {
      Authorization: `Bearer ${MAILERSEND_API_KEY}`,
      "X-Requested-With": "XMLHttpRequest",
      "Content-type": "application/json"
    },
    body: JSON.stringify(BODY)
  };
}

export async function sendActivationMail(name: string, email: string, activationCode: string) {
  const request = createRequest(name, email, activationCode);
  const response = await fetch(MAILERSEND_APU_URL, request);

  if (!response.ok) {
    console.error("Can't send verification email:", await response.json());
  }
}
