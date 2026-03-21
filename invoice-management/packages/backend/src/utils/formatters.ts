/**
 * Generates the forwarding email address for a user.
 * Centralised here so the format is defined in one place.
 */
export function buildForwardingEmail(userId: string): string {
  return `invoices-${userId.slice(0, 8)}@yourdomain.com`;
}
