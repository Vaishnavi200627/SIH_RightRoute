const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Fire-and-forget. If the backend is unreachable, nothing breaks.
 * Sends ONLY category and language. Never intake answers.
 */
export function ping(category, language) {
  if (!API_URL) return;
  fetch(`${API_URL}/api/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, language })
  }).catch(() => {});
}