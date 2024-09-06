import React, { Fragment, useState, useEffect } from 'react'
import UserSearch from './UserSearch'
import ResultsDisplay from './ResultsDisplay'
import ErrorMessage from './ErrorMessage'
import { CLIENTS } from '../../lib/constants'

export default function NewRequisition() {
  const [userData, setUserData] = useState()
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [client] = useState(parseQueryString('client'))
  function parseQueryString(key) {
    const params = new URLSearchParams(document.location.search.substring(1))
    return params.get(key) || null
  }
  useEffect(() => {
    document.title = "New Request"
  }, []);
  return (
    <div className="c-new-request">
      <div className="u-padding-left u-padding-right">
        <h1 className="u-margin-top u-padding-top u-margin-bot u-h2">Select a {CLIENTS[client].title}</h1>
          <Fragment>
            <UserSearch client={client} searchTerm={searchTerm} updateSearchTerm={setSearchTerm} updateData={setUserData} updateError={setError} error={error}/>
            <div className="u-margin-bot-small c-new-request__label">
              <label htmlFor="search">Search for a {CLIENTS[client].instructions}</label>
            </div>
            {!!userData && <ResultsDisplay client={client} data={userData} />}
            {error && <ErrorMessage type="server" />}
          </Fragment>
      </div>
    </div>
  )
}