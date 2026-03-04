// Node.js v25+ exposes a global `localStorage` object that lacks working
// methods (getItem, setItem, etc.) unless --localstorage-file is provided.
// Libraries like `debug` (bundled in @sanity/client) check
// `typeof localStorage !== 'undefined'` then call `.getItem()`, which throws.
// Remove the broken global so those checks fall through to server-side fallbacks.
export function register() {
  if (
    typeof localStorage !== 'undefined' &&
    typeof localStorage.getItem !== 'function'
  ) {
    ;(globalThis as any).localStorage = undefined
  }
}
