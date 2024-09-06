import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import { fetchProduct } from './actions'
import store from './store'
import './scss/index.scss'

// The element we're rendering the app into.
const element = document.getElementById('app-product')

// Pull the insight number from the URL.
const urlParams = (new URL(document.location)).searchParams
const insightNumber = urlParams.get('id')

// Dispatch an action to fetch the product information.
store.dispatch(fetchProduct(insightNumber))

// Our app, wrapped in our Redux store, passing in data attributes.
const app = (
  <Provider store={store}>
    <App {...element.dataset} />
  </Provider>
)

// Render our app into the DOM.
ReactDOM.render(app, element)
