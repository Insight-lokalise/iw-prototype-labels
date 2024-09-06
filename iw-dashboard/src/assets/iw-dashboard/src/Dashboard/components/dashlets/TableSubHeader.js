import React from 'react'
import PropTypes from 'prop-types'
import { IWAnchor, IWFlagIcon, IWInfoIcon } from '../../../iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
export default function TableSubHeader(props) {
  const totalNumberOfColumns = props.numberOfColumns + 1
  return (
    <tbody className="iw-table__tbody">
      <tr className="iw-table__row">
        <th className="dashlet__table-subheading" colSpan={totalNumberOfColumns}>
          <IWFlagIcon countryCode={props.countryCode} className="dashlet__table-flag" />
          {props.webGroupName}
          {props.subHeaderLink ? (
            <IWAnchor href={props.subHeaderLink.href} className="dashlet__link">
              {t(props.subHeaderLink.text)}
            </IWAnchor>
          ) : (
            <IWInfoIcon
              className="dashlet__tooltip"
              tooltip={t(
                'To see the detail of the requisition, select the appropriate web group in the top navigation drop-down and then choose My requisition history'
              )}
            />
          )}
        </th>
      </tr>
    </tbody>
  )
}

TableSubHeader.propTypes = {
  // implicit from RTRow
  numberOfColumns: PropTypes.number.isRequired,
  // explicit
  webGroupName: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  subHeaderLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
}

TableSubHeader.defaultProps = {
  subHeaderLink: null,
}
