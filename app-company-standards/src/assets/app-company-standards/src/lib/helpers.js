export function getWebGroupId(isManagerView) {
  if (isManagerView) return null
  if (document.location.hash) {
    const hashArray = document.location.hash.split('#')
    const wId = hashArray.find(entry => entry.includes('webgroupId') || entry.includes('webGroupId'))
    if (wId) return Number(wId.split('=')[1]) || null
  }
  const params = new URLSearchParams(document.location.search.substring(1))
  return Number(params.get('wId')) || Number(window.webGroupId) || null
}

export function getLanguage(locale) {
  return locale.split('_')[0]
}
