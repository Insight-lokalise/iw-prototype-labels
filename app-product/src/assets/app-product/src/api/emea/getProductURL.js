export default function getProductURL(product) {
  return `${window.siteHrefCurrentBase}/product?id=${product && product.insightNumber}`
}
