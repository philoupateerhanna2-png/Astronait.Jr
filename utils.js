/** Small shared helpers. Keep feature-specific behavior out of this module. */
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
export const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
}[ch]));
export const safeText = (element, value) => {
  if (element) element.textContent = value == null ? "" : String(value);
  return element;
};
export const formatDate = (value, options = {}) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, options).format(date);
};
export const currentYear = () => new Date().getFullYear();
export const storageGet = (storage, key) => { try { return storage.getItem(key); } catch { return null; } };
export const storageSet = (storage, key, value) => { try { storage.setItem(key, value); return true; } catch { return false; } };
export const storageRemove = (storage, key) => { try { storage.removeItem(key); } catch {} };
