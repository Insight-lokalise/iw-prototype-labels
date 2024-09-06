
export function isFeatureEnabled(flag) {
  return window.flags && window.flags[flag]
}
