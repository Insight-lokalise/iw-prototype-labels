import React from 'react'
import PropTypes from 'prop-types'

/**
 * Display up to three product numbers: (1) the Insight number, (2) the
 * manufacturer number, and (3) the UNSPSC number.
 * 
 * Note: Only the Insight number is mandatory.
 * 
 * TODO: This component contains translatable labels.
 */
export default function ProductPartNumbers({ insightNumber, manufacturerNumber, unspscNumber }) {
  return (
    <table className="c-structured-list  c-structured-list--inline  c-part-numbers  c-product-part-numbers  u-margin-bot-small">
      <caption className="c-structured-list__caption  u-hide-visually">Part numbers</caption>
      <tbody className="c-structured-list__items">
        <ProductPartNumber term="Insight #:" description={insightNumber} />
        {manufacturerNumber &&
          <ProductPartNumber term="Mfr. #:" description={manufacturerNumber} />
        }
        {unspscNumber &&
          <ProductPartNumber term="UNSPSC:" description={unspscNumber} />
        }
      </tbody>
    </table>
  )
}

ProductPartNumbers.propTypes = {
  insightNumber: PropTypes.string.isRequired,
  manufacturerNumber: PropTypes.string,
  unspscNumber: PropTypes.string,
}

ProductPartNumbers.defaultProps = {
  manufacturerNumber: null,
  unspscNumber: null,
}

/**
 * Render an individual product number.
 */
function ProductPartNumber({ term, description }) {
  return (
    <tr className="c-structured-list__item" scope="row">
      <th className="c-structured-list__term">{term}</th>
      <td className="c-structured-list__description">{description}</td>
    </tr>
  )
}
