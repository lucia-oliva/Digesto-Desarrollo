const CONTACT_DEPENDENCIES = Object.freeze({
  "1": { label: "Aplicadas", env: "CONTACT_RECIPIENT_APLICADAS" },
  "2": { label: "Exactas", env: "CONTACT_RECIPIENT_EXACTAS" },
  "3": { label: "Salud", env: "CONTACT_RECIPIENT_SALUD" },
  "4": { label: "Sociales", env: "CONTACT_RECIPIENT_SOCIALES" },
  "5": { label: "Humanas", env: "CONTACT_RECIPIENT_HUMANAS" },
  "20": {
    label: "C. Superior",
    env: "CONTACT_RECIPIENT_CONSEJO_SUPERIOR",
  },
  "22": { label: "Chepes", env: "CONTACT_RECIPIENT_CHEPES" },
  "23": { label: "Catuna", env: "CONTACT_RECIPIENT_CATUNA" },
  "24": { label: "Aimogasta", env: "CONTACT_RECIPIENT_AIMOGASTA" },
  "25": { label: "Chamical", env: "CONTACT_RECIPIENT_CHAMICAL" },
  "26": {
    label: "Villa Union",
    env: "CONTACT_RECIPIENT_VILLA_UNION",
  },
});

const EMAIL_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

function contactError(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  error.publicMessage = publicMessage;
  return error;
}

export function isValidEmailAddress(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    !/[\r\n\0]/.test(value) &&
    EMAIL_PATTERN.test(value)
  );
}

export function resolveContactRecipient(dependenciaId) {
  const normalizedId = String(dependenciaId ?? "").trim();
  const dependency = CONTACT_DEPENDENCIES[normalizedId];

  if (!dependency) {
    throw contactError(
      422,
      "La dependencia seleccionada no está autorizada.",
    );
  }

  const recipient = process.env[dependency.env]?.trim();

  if (!isValidEmailAddress(recipient)) {
    throw contactError(
      503,
      "El canal de contacto para la dependencia no está disponible.",
    );
  }

  return Object.freeze({
    id: normalizedId,
    label: dependency.label,
    recipient,
  });
}
