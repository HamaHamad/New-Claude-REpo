/**
 * Lightweight input sanitization for user-provided text.
 *
 * - Strips null bytes (often used in injection attempts)
 * - Normalizes unicode (NFC) so visually identical strings compare equal
 * - Collapses runs of whitespace
 * - Trims leading/trailing whitespace
 *
 * Does NOT HTML-escape — React escapes by default when rendering. Use this
 * for text that will be stored or sent to an LLM.
 */
export function sanitizeUserText(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/\0/g, '')                   // null bytes
    .normalize('NFC')                     // unicode normalization
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width chars
    .replace(/\s{3,}/g, '  ')             // collapse 3+ spaces to 2
    .trim()
}

/**
 * Sanitize a string for safe storage as JSON field metadata.
 * Returns the cleaned string, or null if empty.
 */
export function sanitizeOptional(input: string | null | undefined): string | null {
  if (!input) return null
  const cleaned = sanitizeUserText(input)
  return cleaned.length > 0 ? cleaned : null
}

/**
 * Strip HTML tags from a string (for plain-text rendering of e.g. RSS descriptions).
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}
