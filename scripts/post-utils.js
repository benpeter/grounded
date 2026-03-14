// tva

/**
 * Shared post utilities used by post-index and post-detail blocks.
 */

export const TYPE_LABELS = {
  'build-log': 'Build Log',
  pattern: 'Pattern',
  'tool-report': 'Tool Report',
  til: 'TIL',
};

export const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Parse a date value from query-index.json.
 * EDS may return Unix timestamps (seconds) or ISO strings.
 * Returns a millisecond timestamp for use with Date().
 * @param {string|number} value
 * @returns {number}
 */
export function parseDate(value) {
  if (!value) return 0;
  const num = Number(value);
  if (!Number.isNaN(num) && num > 0 && num < 1e10) {
    // EDS returns Unix timestamps in seconds. 1e10 distinguishes seconds (10 digits)
    // from milliseconds (13 digits) to prevent double-multiplication.
    return num * 1000;
  }
  return new Date(value).getTime() || 0;
}

/**
 * Format a millisecond timestamp as YYYY-MM-DD for datetime attributes.
 * @param {number} ms
 * @returns {string}
 */
export function toIsoDate(ms) {
  const d = new Date(ms);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
