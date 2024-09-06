import React from 'react'
import {t} from "@insight/toolkit-utils";
import {Button} from "@insight/toolkit-react";

export const NoResultsFoundWithFacets = ({ clearFilters }) => {
  return <div className='c-search-no-results-found'>
    <section>
      <h3>{t('No results found with current filters')}</h3>
      <div className="u-margin-bot">
        <div>
          <Button
            className="c-search-no-results-found__clear-all"
            color="inline-link"
            onClick={() => clearFilters()}
          >
            {t('Clear all filters')}
          </Button>{` ${t('to display more results.')}`}
        </div>
      </div>
    </section>
  </div>
}
