export default function getSearchURL(query) {
  return query ? `${window.siteHrefCurrentBase}/apps/nbs/results.php?K=${query}` : null
}
