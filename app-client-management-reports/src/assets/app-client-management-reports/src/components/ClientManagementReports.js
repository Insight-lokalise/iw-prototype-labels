import React from 'react'
import PropTypes from 'prop-types'
import { REPORT_TYPES } from 'api'
import { Tooltip, Button } from '@insight/toolkit-react'
import { Link } from "react-router-dom";

export default function  ClientManagementReports() {
  return (
    <div className="ds-v1">
      <div className="app-client-management-reports">
        <h1 className="u-h4">Client management reports</h1>
        <div className="c-client-management-reports o-grid o-grid--gutters-huge">
          {REPORT_TYPES.map(({id, label, description}) => {
            return (
              <div key={id} className="o-grid__item u-1/1 u-1/3@desktop">
                <Tooltip content={description}>
                  <Link to={{
                    pathname: id,
                    state: {
                      description,
                    }
                  }}>{label}</Link>
                </Tooltip>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

ClientManagementReports.propTypes = {
}
