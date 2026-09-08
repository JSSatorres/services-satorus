/**
 * Reads the comma-separated recipient list configured for contact emails.
 * Resend accepts an array, so each address receives its own copy.
 */
export function contactRecipients() {
  const recipients = (process.env.CONTACT_TO_EMAIL ?? "info@satorus.es")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  return recipients.length > 0 ? recipients : ["info@satorus.es"];
}
