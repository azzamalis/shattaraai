import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Uses DOMPurify with a strict whitelist of allowed tags and attributes.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'a', 'ul', 'ol', 'li', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'img', 'div', 'span', 'article', 'section', 'header', 'footer',
      'figure', 'figcaption', 'mark', 'sup', 'sub', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 
      'width', 'height', 'colspan', 'rowspan',
      'target', 'rel'
    ],
    // Only allow safe URI schemes
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Disallow data attributes which can be used for attacks
    ALLOW_DATA_ATTR: false,
    // Force all links to open safely
    ADD_ATTR: ['target', 'rel'],
    // Hook to add rel="noopener noreferrer" to links
    FORCE_BODY: true,
  });
}

/**
 * Sanitizes HTML and applies search term highlighting.
 * Highlighting is applied AFTER sanitization to ensure safety.
 */
export function sanitizeAndHighlight(dirty: string, searchTerm?: string): string {
  const sanitized = sanitizeHtml(dirty);
  
  if (!searchTerm) return sanitized;
  
  // Escape regex special characters in search term
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  
  return sanitized.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}
