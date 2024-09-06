import React  from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './components/Routes'

export default function App() {
  return (
    <BrowserRouter basename="insightweb">
      <Routes />
    </BrowserRouter>
  )
}
