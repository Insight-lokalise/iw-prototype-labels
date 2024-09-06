import React, { useContext, useEffect, useState, Fragment } from "react";
import { Button, Icon, Loading } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils";

import { SearchContext } from "./SearchContext";
import Header from "./Header";
import Paginator from "./Paginator";
import Result from "./Result";
import { ROUTES } from '../Routes'
import RedirectToTarget from "../Navigation/RedirectToTarget";

export default function Search(props) {
  const {
    isSearching,
    pageCount,
    resultCount,
    results,
    search,
    searchString,
    searchInitiated
  } = useContext(SearchContext);


  useEffect(() => {
    if (!isSearching && results.length === 0 && searchString)
      search(searchString);
    else if(isSearching && !searchString) {
      //Redirect to main route when page refreshes because searchString will be empty when app reloads and won't render this component
      //Example: On language change.
      const target = RedirectToTarget({ targetLevel: 0 })
      props.history.push(target)
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  if (currentPage > pageCount) setCurrentPage(0);

  const resultsNotFound = searchInitiated ? (
    <div className="o-grid__item u-1/1">
      <span>{t("No results found")}</span>
    </div>
  ) : (
    <div className="o-grid__item u-1/1">
      <span>{t("Enter a search term above")}</span>
    </div>
  );

  const renderResults = results && results[currentPage] ? (
    <Fragment>
      <div className="o-grid__item u-1/1">
        {results[currentPage].map((result, index) => (
          <Result
            key={`${result.resultId}-${index}`}
            {...result}
          />
        ))}
      </div>
      <div className="o-grid__item">
        <Paginator
          changePage={setCurrentPage}
          currentPage={currentPage}
          maxPage={pageCount}
        />
      </div>
    </Fragment>
  ) : (
    <Fragment>{resultsNotFound}</Fragment>
  )

  return (
    <div className="o-grid u-padding-side-small">
      <div className="o-grid__item u-1/1">
        {isSearching ? (
          <div className="o-grid__item">
            <Loading />
          </div>
        ) : (
          <div className="o-grid">
            <div className="o-grid__item u-1/1">
              <Button
                className="c-cs-back--button u-font-size-small"
                color="link"
                onClick={() => {
                  props.history.goBack();
                }}
              >
                <Icon icon="arrow-dropdown" className="c-cs-back--icon" />{" "}
                {t("Back")}
              </Button>
            </div>
            <div aria-label="searchResults" className="o-grid__item u-1/1">
              <div className={"o-grid__item u-1/1 u-margin-bot"}>
                <Header
                  currentPage={currentPage}
                  pageCount={pageCount}
                  results={results}
                  resultCount={resultCount}
                  searchString={searchString}
                  searchInitiated={searchInitiated}
                />
              </div>
              {renderResults}
            </div>
          </div>
          )}
      </div>
    </div>
  );
}
