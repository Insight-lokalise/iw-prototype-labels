import React, { createContext, useReducer, useContext } from "react";

import { fetchSearchResults } from "../../api";
import { LanguageContext } from "../../lib";

export const SearchContext = createContext({
  backSearch: () => { },
  isSearching: false,
  pageCount: 0,
  results: [],
  search: () => { },
  searchString: "",
  searchInitiated: false,
});

export function SearchProvider({ children, wId }) {
  const { lang } = useContext(LanguageContext)
  const [
    {
      beyondSearchLimit,
      isSearching,
      pageCount,
      resultCount,
      results,
      searchString,
      searchInitiated
    },
    dispatch
  ] = useReducer(reducer, initialState);

  function search(inputString) {
    if (!inputString || inputString === searchString) return;
    dispatch({ type: "INITIATED", payload: inputString });
    fetchSearchResults({ lang, searchString: inputString, wId }).then(
      ({ data }) => {
        dispatch({ type: "COMPLETED", payload: data });
      }
    );
  }

  function backSearch() {
    dispatch({ type: "INITIATED", payload: searchString });
    fetchSearchResults({ lang, searchString, wId }).then(
      ({ data }) => {
        dispatch({ type: "COMPLETED", payload: data });
      }
    );
  }

  return (
    <SearchContext.Provider
      value={{
        isSearching,
        backSearch,
        beyondSearchLimit,
        pageCount,
        resultCount,
        results,
        search,
        searchString,
        searchInitiated,
        wId
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

function reducer(state, { type, payload }) {
  switch (type) {
    case "INITIATED":
      return { ...state, searchInitiated: true, isSearching: true, searchString: payload };
    case "COMPLETED":
      return {
        ...state,
        beyondSearchLimit: payload.length > 500,
        isSearching: false,
        pageCount: Math.floor(Math.min(payload.length, 500) / 25),
        resultCount: Math.min(payload.length, 500),
        results: paginateSearchResults(payload, 25)
      };
  }
}

const initialState = {
  isSearching: false,
  pageCount: 1,
  resultCount: 0,
  results: [],
  searchString: "",
  beyondSearchLimit: false,
  searchInitiated: false,
};

function paginateSearchResults(results, entriesPerPage) {
  return results.reduce((acc, curr, index) => {
    if (index > 499) return acc;
    const page = Math.floor(index / entriesPerPage);
    if (!acc[page]) acc.push([]);
    acc[page].push(curr);
    return acc;
  }, []);
}
