import React, {useState} from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ToastList } from '@insight/toolkit-react/lib/Toast'
import { PaymentCardIconSymbols } from '@insight/toolkit-react/lib/PaymentCardIcon'
import { BREADCRUMBS, ROUTES } from '@constants'
import AccountCenter from './components/AccountCenter'
import { AddAddress, EditAddress, Addresses } from './components/Address'
import { Accounts } from './components/Accounts'
import { Payments, AddNewPaymentCard, EditStoredPaymentCard} from './components/PaymentInformation'
import AccountCenterBreadcrumb from "./components/AccountCenterBreadcrumb";
import ScrollToTop from './components/ScrollToTop'

export default function RouteComponent() {
  const [toasts, setToasts] = useState([])
  const removeToast = removedToast => {
    const newToasts = toasts.filter(({ id }) => id !== removedToast.id)
    setToasts(newToasts)
  }
  const addToast = ({message, type}) => {
    const toast = {
      title: '',
      text: (
        <div>{message}</div>
      ),
      id: 'account-center-toast',
      type
    }
    setToasts([toast])
  }
  const components = {
    MY_ACCOUNT: <AccountCenter addToast={addToast} />,
    ADD_ADDRESS: <AddAddress addToast={addToast} />,
    EDIT_ADDRESS: <EditAddress addToast={addToast} />,
    MANAGE_ADDRESS: <Addresses addToast={addToast} />,
    ADD_PAYMENT: <AddNewPaymentCard addToast={addToast} />,
    MANAGE_PAYMENT: <Payments addToast={addToast} />,
    EDIT_PAYMENT: <EditStoredPaymentCard addToast={addToast} />,
    ACCOUNTS: <Accounts addToast={addToast} />
  }

	return (
  <div>
    <PaymentCardIconSymbols />
    <BrowserRouter basename='/insightweb'>
      <ScrollToTop />
      <Switch>
        {Object.keys(ROUTES).map ((name, key) => (
          <Route
            exact
            path={ROUTES[name].url}
            key={key}
            render={() => {
              return (
                <>
                  <AccountCenterBreadcrumb breadcrumb={BREADCRUMBS[name]} routeName={ROUTES[name].name} key={key} />
                  {components[name]}
                </>
              )
            }}
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
