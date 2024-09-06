export const scrollIntoView = (elementId, behavior = 'smooth') => {
  if (!elementId) return

  // Find and get header height
  const header = document.getElementById('app-header')
  let headerOffset = 0
  if (header && header.offsetHeight) {
    headerOffset = header.offsetHeight
  }

  // Get target element by id and set offset height
  const view = document.getElementById(elementId)
  if (!view) return
  const viewTop = view.offsetTop
  if (!viewTop) return

  // Scroll the window to target top minus header offset
  window.scrollTo({
    behavior,
    top: viewTop - headerOffset,
  })
}

export default scrollIntoView
