import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ToastList } from '@insight/toolkit-react/lib/Toast'
import { BREADCRUMBS, ROUTES } from '@constants'
import { StoredCartsPage } from './components/StoredCartsPage/StoredCartsPage'
import Breadcrumb from './components/Breadcrumb'
import { getLoginId } from './api/getStoredCarts'

/** Have to try with react-router-dom version 6 **/
export default function RouteComponent() {
  const [toasts, setToasts] = useState([])
  const [loginId, setLoginId] = useState('')
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
      id: 'saved-lists-toast',
      type
    }
    setToasts([toast])
  }
  const components = {
    SAVED_LISTS: (
      <StoredCartsPage addToast={addToast} loginId={loginId}/>
    ),
  }

  useEffect(()=> {
    getLoginId().then((res) => setLoginId(res))
  },[])

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
                    routeName={ROUTES[name].name}
                    key={key}
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
