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

export function fetchAdvancedSearchOrder(searchObj, pageDetails) {
  const advancedSearchObject = {
    filters: {
      status: searchObj.status,
      dateRange: {
        startDate: formatDate(searchObj.startDate),
        endDate: formatDate(searchObj.endDate),
      },
      levelIndex: searchObj.levelIndex,
      accountSelection: (searchObj.region && searchObj.region[0]) || "ALL*ALL",
      productType: searchObj.productType,
      orders: searchObj.orders,
      orderType: searchObj.orderType,
    },
  };
  return getAdvancedOrderResults(advancedSearchObject, pageDetails);
}

export function getAdvancedOrderResults(searchObj, pageDetails) {
  const searchBody = {
    ...searchObj,
    recordsPerPage: pageDetails.recordsPerPage,
    sortBy: pageDetails.sortBy,
    sortOrder: pageDetails.sortOrder,
    startPage: pageDetails.startPage,
  };
  return axios.post("orderSearch/advanced", searchBody).then((response) => {
    const body = {
      ...response.data,
      advancedSearchObject:
        searchObj /* To access searchobj while trigeering API call, on click on pagination */,
    };
    return body;
  });
}

export async function fetchSimplifiedSearchOrder(searchObj) {
  const { soldto, wgId } = searchObj;
  const {
    locale,
    userInformation: { salesOrg },
  } = await getUser();
  const tempSearchObj = { ...searchObj, locale, salesorg: salesOrg };

  return axios
    .post(`/api/reporting/order/orderSearch`, tempSearchObj, {
      params: { soldto, wgId },
    })
    .then(({ data }) => {
      const body = {
        ...data,
        locale,
        salesorg: salesOrg,
        advancedSearchObject:
          searchObj /* To access searchobj while trigeering API call, on click on pagination */,
      };
      return body;
    });
}

export function fetchRegionsByBillTo() {
  return axios
    .get("report/getRegionsByBillTo/order")
    .catch((error) => {
      console.warn("Failed to fetch regions by billTo for the order");
      throw error;
    })
    .then((response) => {
      return response.data;
    });
}

export function fetchHierarchyTreeDropDown() {
  return axios
    .get("report/getHierarchyTreeDropDown/order")
    .catch((error) => {
      console.warn("Failed to fetch hierarchy tree for the order");
      throw error;
    })
    .then((response) => {
      return response.data;
    });
}
