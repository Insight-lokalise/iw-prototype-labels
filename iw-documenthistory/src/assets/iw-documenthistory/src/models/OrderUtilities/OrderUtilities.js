import axios from "axios";
import { formatDate } from "../../Orders/Search/constants/Date";
import { loadUser } from "../User";

let cachedUser;

const getUser = async () => {
  if (!cachedUser) {
    cachedUser = await loadUser();
  }
  return cachedUser;
};

/**
 * Cause the browser to download an excel-formatted document of the orders.
 * @return {undefined}
 */
const exportAsXLS = async (isCES, exportView, searchObj) => {
  if (isCES) {
    const {
      soldto,
      wgId,
      sortOrder,
      sortBy,
      filters: { dateRange, orderType, productType, searchText, status },
    } = searchObj;
    const startDate = dateRange.startDate
      ? formatDate(dateRange.startDate)
      : "";
    const endDate = dateRange.endDate ? formatDate(dateRange.endDate) : "";
    const {
      locale,
      userInformation: { salesOrg },
    } = await getUser();

    axios({
      url: `/api/reporting/order/orderSearchExport?soldto=${soldto}&wgId=${wgId}&searchText=${searchText}&startDate=${startDate}&endDate=${endDate}&status=${status}&productType=${productType}&orderType=${orderType}&sortOrder=${sortOrder}&sortBy=${sortBy}&locale=${locale}&salesorg=${salesOrg}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orderHistory.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  } else {
    let exportURL = "insightweb/export/history";
    if (exportView === "quickSearch") {
      exportURL = "insightweb/export/quick";
    } else if (exportView === "advancedSearch") {
      exportURL = "insightweb/export/advanced";
    }
    window.location.assign(`${window.location.origin}/${exportURL}`);
  }
};
export default exportAsXLS;

export function addItemToCart(cartURL, item) {
  const timestamp = new Date().getTime();
  return axios.post(`${cartURL}?_=${timestamp}`, item).catch((error) => {
    console.warn(`Failed to add item ${JSON.stringify(item)} to cart`);
    throw error;
  });
}
