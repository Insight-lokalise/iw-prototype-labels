const getWebPrice = ({ webPrice, listPrice, insightPrice, isLoggedIn }) => {
  const newWebPriceFeature =
      window.flags && window.flags['GNA-11926-NEW-WEB-PRICING'];
  if (newWebPriceFeature) {
      return webPrice;
  }
  return isLoggedIn ? insightPrice : listPrice;
}
export default getWebPrice;
