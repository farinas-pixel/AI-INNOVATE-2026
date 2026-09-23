/**
 * FORMSPREE CONFIGURATION
 * 
 * Replace FORMSPREE_ENDPOINT with your actual Formspree endpoint URL:
 * Example: "https://formspree.io/f/mqkvojzb"
 * 
 * Do NOT invent a fake endpoint. You can insert your real endpoint below.
 * When this constant is empty or contains the placeholder, the app gracefully
 * handles submissions in preview mode by simulating the network request and
 * saving the registration locally so you can test all features (passes, QR, etc).
 */
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgavyvde";

/**
 * Checks if a Formspree endpoint is genuinely configured
 */
export function isFormspreeConfigured(endpoint: string = FORMSPREE_ENDPOINT): boolean {
  if (!endpoint || typeof endpoint !== 'string') return false;
  const trimmed = endpoint.trim();
  return (
    trimmed.startsWith('https://formspree.io/f/') &&
    !trimmed.includes('YOUR_FORM_ID') &&
    !trimmed.includes('PLACEHOLDER') &&
    trimmed.length > 25
  );
}
