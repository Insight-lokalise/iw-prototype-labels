export default function getCategoryURL(category) {
  return `${window.siteHrefCurrentBase}/category/${category && category.url}`
}
