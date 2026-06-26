// Resolves product image URLs to full server URLs
// Handles both old full URLs (http://localhost:5888/uploads/...) and new relative paths (/uploads/...)
const SERVER_BASE = 'http://localhost:5888';

export function getImageUrl(imageUrl) {
  if (!imageUrl) return '';
  
  // Already a full URL (old format or external URL)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Fix old localhost URLs to use current server base
    if (imageUrl.includes('/uploads/')) {
      const filename = imageUrl.split('/uploads/').pop();
      return `${SERVER_BASE}/uploads/${filename}`;
    }
    return imageUrl;
  }
  
  // Relative path (new format: /uploads/filename.png)
  if (imageUrl.startsWith('/uploads/')) {
    return `${SERVER_BASE}${imageUrl}`;
  }
  
  // Fallback: just prepend server base
  return `${SERVER_BASE}/${imageUrl}`;
}
