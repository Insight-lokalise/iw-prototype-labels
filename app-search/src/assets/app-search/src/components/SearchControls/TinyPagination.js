import React from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export const TinyPagination = ({ currentPage = 1, totalPages, pageHandler }) => {

  const setPage = desiredPage => {
    if (currentPage != desiredPage)
      pageHandler(desiredPage)
  }

  return (
    <div className="c-tiny-pagination o-grid o-grid--justify-right">
      <Button
        className="c-tiny-pagination__box c-tiny-pagination__box--prev"
        color="secondary"
        icon="arrow-left"
        isDisabled={currentPage <= 1}
        size="small"
        onClick={() => setPage(currentPage - 1)}
        aria-label={t("Go to next page")}
        data-testid="pagination-mobile-next"
      />
      <span className="c-tiny-pagination__current-page"><strong>{t('Page')} {currentPage}</strong></span>
      <Button
        className="c-tiny-pagination__box c-tiny-pagination__box--next"
        color="secondary"
        icon="arrow-right"
        isDisabled={currentPage >= totalPages}
        onClick={() => setPage(currentPage + 1)}
        size="small"
        aria-label={t("Go to next page")}
        data-testid="pagination-mobile-next"
      />
    </div>
  )
}
