import React, { useState } from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import QuoteDetailsEmailModal from './QuoteDetailsEmailModal'

const QuoteDetailsUtilityLinks = ({ quoteId, addToast }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  return (
    <div className="o-grid hide-for-print">
      <div className="o-grid__item u-1/1 c-app-quote-details__actions u-margin-bot-tiny">
        <Button
          className="c-app-quote-details__actions__action"
          data-testid="print"
          color="link"
          aria-label={t('print')}
          icon="print"
          iconPosition="right"
          onClick={window.print}
        >
          {t('Print')}
        </Button>
      </div>
      <div className="o-grid__item u-1/1 c-app-quote-details__actions">
        <Button
          className="c-app-quote-details__actions__action"
          data-testid="send-email"
          color="link"
          aria-label={t('email')}
          icon="mail-outline"
          iconPosition="right"
          onClick={() => setIsEmailModalOpen(true)}
        >
          {t('Email')}
        </Button>
        <QuoteDetailsEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          quoteId={quoteId}
          addToast={addToast}
        />
      </div>
    </div>
  )
}

export default QuoteDetailsUtilityLinks
