import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ToastList } from '@insight/toolkit-react/lib/Toast'
import { BREADCRUMBS, ROUTES } from '@constants'
import QuotesPage from './components/QuotesPage/QuotesPage'
import QuotesDetailPage from './components/QuoteDetailsPage/QuoteDetailsPage'
import Breadcrumb from './components/Breadcrumb'
import { SaveQuotePage } from './components/SaveQuotePage/SaveQuotePage'
import { SaveQuoteConfirmationPage } from './components/SaveQuoteConfirmationPage/SaveQuoteConfirmationPage'
import { QuoteDetailsContextProvider } from './context/QuoteDetailsContext'
import { SaveQuoteContextProvider } from './context/SaveQuoteContext'
import { getCurrentLocale } from '@insight/toolkit-utils'

/** Have to try with react-router-dom version 6 **/
export default function RouteComponent({ isCES, webGroupId }) {
  const locale = getCurrentLocale("insight_current_locale");
  const [toasts, setToasts] = useState([])
  const removeToast = (removedToast) => {
    const newToasts = toasts.filter(({ id }) => id !== removedToast.id)
    setToasts(newToasts)
  }

  const addToast = ({ message, type }) => {
    const toast = {
      title: '',
      text: <div>{message}</div>,
      id: 'save-as-quote-toast',
      type,
    }
    setToasts([toast])
  }

  const components = {
    QUOTE_HISTORY: <QuotesPage />,
    QUOTE_DETAIL: (
      <QuoteDetailsContextProvider>
        <QuotesDetailPage addToast={addToast}  locale={locale} />
      </QuoteDetailsContextProvider>
    ),
    SAVE_QUOTE: (
      <SaveQuoteContextProvider>
        <SaveQuotePage addToast={addToast}  locale={locale} />
      </SaveQuoteContextProvider>
    ),
    SAVE_QUOTE_CONFIRM: <SaveQuoteConfirmationPage />,
  }
  return (
    <div>
      <BrowserRouter basename="/insightweb">
        <Switch>
          {Object.keys(ROUTES).map((name, key) => (
            <Route
              exact
              path={ROUTES[name].url}
              key={key}
              render={(props) => (
                <React.Fragment>
                  <Breadcrumb
                    breadcrumb={BREADCRUMBS[name]}
                    isCES={isCES}
                    routeName={ROUTES[name].name}
                    key={key}
                    webGroupId={webGroupId}
                    {...props}
                  />
                  {components[name]}
                </React.Fragment>
              )}
            />
          ))}
        </Switch>
      </BrowserRouter>
      <ToastList
        className="c-ac-toast"
        toasts={toasts}
        dismissToast={removeToast}
        toastDisplayDuration={3000}
        toastFadeDuration={250}
      />
    </div>
  )
}
