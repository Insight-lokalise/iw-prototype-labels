import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Panel, Toggle, Button } from '@insight/toolkit-react'

import AppContext from '../context/AppProvider'
import { formatDate, parseTimeToUTCFormat } from '../helpers';
import { runCatalog, fetchOBCPrevRunTimeInfo, updateSetupDeliveryData } from '../api/us';

export default function Header({ info, runCount, updateDeliveryFields }) {
  const { setupDeliveryInfo, setupDeliveryInfo: { partnerNumber, timeZone,
    timeZoneRegion, lastRunEndDate, status, nextRunDate } } = useContext(AppContext)
  const [toggleStatus, setToggleStatus] = useState(status === 'Ready')
  const [obcPrevRunTimeInfo, setObcPrevRunTimeInfo] = useState({})
  useEffect(() => {
    fetchOBCPrevRunTimeInfo(info.catalogId).then((response) => { setObcPrevRunTimeInfo(response?.data) }).
      catch(error => console.warn('failed fetching the previous run info', error))
  }, [])
  const onRunCatalog = (catalogId) => {
    runCatalog(catalogId)
  }
  const onToggleClick = (value) => {
    const statusOfObc = value ? 'Ready' : 'Disabled'
    updateDeliveryFields({ status: statusOfObc })
    const dataToSend = { ...setupDeliveryInfo, status: statusOfObc }
    setToggleStatus(value)
    updateSetupDeliveryData(dataToSend)
  }
  return (
    <Panel className="u-margin-bot c-app-obc__header">
      <Panel.Title><span className="c-title">Client Information</span></Panel.Title>
      <Panel.Body>
        <div className='o-grid'>
          <div className='o-grid__item'>
            <span className="u-text-bolder">Catalog ID: </span>{info.catalogId}<br />
            <span className="u-text-bolder">Number of Parts: </span>{runCount}<br />
            <span className="u-text-bolder">Sales Id: </span>{info.salesOrg}<br />
            <span className="u-text-bolder">Web Group ID: </span>{info.webGroupId}<br />
            <span className="u-text-bolder">Sold To: </span>{partnerNumber || info.soldTo}<br />
          </div>
          <div className='o-grid__item'>
            <div className='o-grid'>
              <span className='u-text-bolder o-grid__item u-text-right'>Activate catalog</span>
              <Toggle
                isToggled={toggleStatus}
                onClick={() => onToggleClick(!toggleStatus)}
                offLabelText="Off"
                onLabelText="On"
                className='o-grid__item u-1/6'
              />
            </div>
          </div>
        </div>
        <div className='o-grid o-grid--gutters-huge c-status-section'>
          <div className='o-grid__item'>
            <span className="u-text-bolder">Previous run time: </span><br />
            <span className="u-text-bolder">Status: </span>{obcPrevRunTimeInfo?.status}<br />
            <span className="u-text-bolder">Region: </span>{timeZoneRegion}<br />
            <span className="u-text-bolder">TimeZone: </span>{timeZone}<br />
            <span className='u-text-bolder'>Date: </span>{lastRunEndDate ? formatDate(new Date(lastRunEndDate)) : ''}<br />
            <span className='u-text-bolder'>Time: </span>{lastRunEndDate ? parseTimeToUTCFormat(new Date(lastRunEndDate)) : ''}<br />
          </div>
          {toggleStatus ?
            <div className='o-grid__item'>
              <span className="u-text-bolder">Next run time: </span><br />
              <span className="u-text-bolder">Region: </span>{timeZoneRegion}<br />
              <span className="u-text-bolder">TimeZone: </span>{timeZone}<br />
              <span className='u-text-bolder'>Date: </span>{nextRunDate ? formatDate(new Date(nextRunDate)) : ''}<br />
              <span className='u-text-bolder'>Time: </span>{nextRunDate ? parseTimeToUTCFormat(new Date(nextRunDate)) : ''}<br />
            </div>
            : null
          }
          <div className='o-grid__item u-text-right'>
            <Button color="secondary" isDisabled={!toggleStatus} size="small" onClick={() => onRunCatalog(info.catalogId)}>
              Run Catalog Now
            </Button>
          </div>
        </div>
      </Panel.Body>
    </Panel>
  )
}

Header.propTypes = {
  info: PropTypes.shape({
    soldTo: PropTypes.number,
    salesOrg: PropTypes.string,
    catalogId: PropTypes.string,
    webGroupId: PropTypes.number
  }),
  runCount: PropTypes.number,
  updateDeliveryFields: PropTypes.func.isRequired,
}

Header.defaultProps = {
  info: {
    soldTo: 0,
    salesOrg: "",
    catalogId: "",
    webGroupId: 0,
  },
  runCount: 0
}
