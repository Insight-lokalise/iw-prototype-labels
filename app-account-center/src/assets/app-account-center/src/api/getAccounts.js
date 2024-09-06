import axios from "axios";

let getAllAccountsCachedResponse;
let getDefaultAccountsCachedResponse;

export default function getAccounts(searchTerm, currentSoldtoNumber) {
  return searchTerm === ""
    ? getDefaultAccounts(currentSoldtoNumber)
    : searchAccounts(searchTerm, currentSoldtoNumber);
}

function getDefaultAccounts(currentSoldtoNumber) {
  if (!getDefaultAccountsCachedResponse) {
    const timestamp = new Date().getTime();

    return axios
      .get(`/insightweb/endUser/getCurrentAccountDropDownDetails/${timestamp}`)
      .catch((error) => {
        console.warn("Failed to fetch account data", error);
        throw error;
      })
      .then(({ data }) => ({
        results:
          data && data.soldtoList
            ? normalizeAccounts(data.soldtoList.soldToList, currentSoldtoNumber)
            : [],
        totalResults:
          data && data.soldtoList ? data.soldtoList.totalRecords : 1,
      }));
  }

  return getDefaultAccountsCachedResponse;
}

function searchAccounts(searchTerm, currentSoldtoNumber) {
  return getAllAccounts(currentSoldtoNumber).then(
    ({ results, totalResults }) => {
      const words = searchTerm.trim().split(/\s+/);

      let filteredResults = results;
      words.forEach((word) => {
        filteredResults = filteredResults.filter(
          (result) =>
            result.searchText.toUpperCase().indexOf(word.toUpperCase()) !== -1
        );
      });

      return {
        results: filteredResults,
        totalResults,
      };
    }
  );
}

function getAllAccounts(currentSoldtoNumber) {
  if (!getAllAccountsCachedResponse) {
    return axios
      .post("/insightweb/endUser/getCurrentAccount", {
        recordCount: 10000,
        startPage: 1,
      })
      .catch((error) => {
        console.warn("Failed to fetch all accounts data", error);
        throw error;
      })
      .then(({ data }) => ({
        results:
          data && data.soldtoList
            ? normalizeAccounts(data.soldtoList.soldToList, currentSoldtoNumber)
            : [],
        totalResults:
          data && data.soldtoList ? data.soldtoList.totalRecords : 1,
      }));
  }

  return getAllAccountsCachedResponse;
}

function normalizeAccounts(accounts, currentSoldtoNumber) {
  return accounts.map((account) => ({
    ...account,
    id: account.soldtoNumber,
    name: account.soldtoName,
    displayName: `${account.soldtoNumber} ${account.soldtoName}`,
    searchText: `${account.soldtoNumber} ${account.soldtoName}`,
    isActive: account.soldtoNumber === currentSoldtoNumber,
  }));
}
