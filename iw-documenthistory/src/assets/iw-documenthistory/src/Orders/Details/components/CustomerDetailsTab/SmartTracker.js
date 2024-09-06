import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import CustomerDetail from './CustomerDetail'

/**
 * The component selects the smartracker information of
 * any given order and renders the information into blocks
 */
export default function SmartTracker(props) {
  /**
   * It Will render each block (array of objects) inside a container div.
   * @param { array } block
   */
  function renderBlock(block, id) {
    return (
      <div className="columns small-12 large-6 customer-details-tab__block" key={id}>
        {block.map(lineDetail => {
          const { name, value } = lineDetail
          return <CustomerDetail key={t(name)} label={t(name)} value={value} />
        })}
      </div>
    )
  }

  const { blockSize, orderSmartTracker } = props
  const blocks = convertToBlocks(orderSmartTracker, blockSize)

  return <div className="row collapse expanded">{blocks.map((block, id) => renderBlock(block, id))}</div>
}

SmartTracker.propTypes = {
  blockSize: PropTypes.number,
  orderSmartTracker: PropTypes.arrayOf(
    PropTypes.shape({
      /* key value pairs */
    })
  ),
}

SmartTracker.defaultProps = {
  blockSize: 4,
  orderSmartTracker: [],
}

/**
 * It will convert the items inside the array into blocks.
 * The blocks will be contained in their own array with
 * the size specified in blocksize prop.
 * @param { array of objects } array
 * @returns array of arrays
 */
function convertToBlocks(array, blockSize) {
  return array.reduce(
    (acc, value) => {
      if (acc[acc.length - 1].length === blockSize) {
        acc.push([])
      }
      acc[acc.length - 1].push(value)
      return acc
    },
    [[]]
  )
}
