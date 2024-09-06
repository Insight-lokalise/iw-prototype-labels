import React, { useState, Fragment } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import Button from '@insight/toolkit-react/lib/Button/Button'
import ErrorMessage from './ErrorMessage'
import { CLIENTS } from '../../lib/constants'

export default function ResultsDisplay({ client, data }) {
  const [recId, setRecId] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const searchResult = <h2 className="u-h6">Search results</h2>
  const searchSizeExceeded = <ErrorMessage type="resultSizeExceeded" resultType={CLIENTS[client].title} />
  const handleSelect = (e) => setRecId(e.target.value)
  const handleSubmit = () => {
    setIsLoading(true)
  }
  const availableColumns = CLIENTS[client]?.columns

  return (
    data[0] ? (
      <Fragment>
        <div className={cn({ "u-hide-visually": isLoading })}>
          {data.length < 20 ? searchResult : searchSizeExceeded}
          <div className="c-table-container">
            <form aria-label="selectApprovalManagerForm" className="c-new-request__form" id="c-new-request__form" action={`${client}/welcome?recId=${recId}`} method="post">
              <table className="c-table c-table--zebra c-table--hover u-1/1">
                <thead>
                  <tr className="c-data-table__row">
                    <th className="c-table__cell c-table__cell--empty" scope="col"></th>
                    {
                      availableColumns?.map(col => 
                        <th className="c-table__cell" scope="col">{col.title}</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody className="c-table__body c-table__row">
                  {
                    data?.map((dataSlice, idx) => {
                      return (
                        <tr className="c-data-table__row" id={dataSlice.recId} key={idx}>
                          <td className='u-text-center'><input aria-label="selectApprover" name="selectedUser" type="radio" value={dataSlice.recId} onChange={handleSelect} /></td>
                          { 
                            availableColumns?.map(({ id }) => (
                              <td key={id} className="c-table__cell">   
                                <div className="c-cart__cell--qty u-text-left">{dataSlice[id]}</div>
                              </td>
                            ))
                          }
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              <div className="o-grid__item u-1/1">
                <div className="o-grid o-grid--justify-right">
                  <Button onClick={handleSubmit} type="submit" form="c-new-request__form" className="u-margin-bot-large" color="primary" disabled={!recId} >Continue</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={cn("o-grid", { "u-hide-visually": !isLoading })}>
          <div className="c-new-request__loading o-grid__item u-1/1" />
          <div className="o-grid__item u-1/1">
            <div className="o-grid o-grid--justify-center">
              <Loading className="u-padding-top u-padding-bot" />
            </div>
          </div>
        </div>
      </Fragment>) : <ErrorMessage type="noResult" />
  )
}

ResultsDisplay.propTypes = {
  client: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  error: PropTypes.shape({ response: { status } }),
}

ResultsDisplay.defaultProps = {
  data: [{}],
  error: null,
}
