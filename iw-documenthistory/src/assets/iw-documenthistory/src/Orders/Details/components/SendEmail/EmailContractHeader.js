import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export default function EmailContractHeader({ contractName }) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        borderSpacing: 0,
        float: 'none',
        padding: 0,
        textAlign: 'center',
        verticalAlign: 'top',
        width: '100%',
      }}
    >
      <tbody>
        <tr>
          <td>
            <p
              style={{
                margin: 0,
                marginBottom: 0,
                backgroundColor: '#dcf0fa',
                color: '#3e332d',
                fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                fontSize: 14,
                fontWeight: 'normal',
                lineHeight: '1.3',
                padding: '8px 16px 8px 16px',
                textAlign: 'left',
              }}
            >
              {t('Contract')}: <strong>{contractName}</strong>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

EmailContractHeader.propTypes = {
  contractName: PropTypes.string.isRequired,
}
