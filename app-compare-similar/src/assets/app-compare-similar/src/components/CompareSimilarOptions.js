import React, { useState, useEffect } from "react";
import { Button, SendToCollegueModal } from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils'
import sendToColleague from "../api/sendToColleague";
import { isMobile, throttle } from '@insight/toolkit-utils';

const CompareSimilarOptions = () => {
  const [showSendToCollegueModal, setshowSendToCollegueModal] = useState(false)
  const [status, setStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState(t('Email has been sent successfully'))
  const isSearchCompareEmailFlagEnabled = window?.flags['GNA-13744-Search-Compare-Email-Feature']
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isOnMobile, setIsMobile] = useState(isMobile())

  const onEmailClick = () => {
    setshowSendToCollegueModal(true)
  }

  useEffect(() => {
    const onResize = throttle(() => {
      setIsMobile(isMobile())
    }, 250)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleSubmit = async (values) => {
    const response = await sendToColleague(values)
    if (response.data === 'OK') {
      setStatus(true);
      setStatusMessage(t('Email has been sent successfully'))
      setShowErrorMessage(false);
    } else if (response.data === 'FORBIDDEN') {
      setShowErrorMessage(true);
    }
  }

  const onCloseHandler = () => {
    setshowSendToCollegueModal(false);
    setStatusMessage('');
    setStatus(false);
    setShowErrorMessage(false)
  }

  return (
    <>
      {isSearchCompareEmailFlagEnabled && !isOnMobile && <div className='c-compare-similar-options'>
        <Button color="inline-link" icon={'mail-outline'} iconPosition={'left'} onClick={onEmailClick}>
          {t('Email')}
        </Button>
        {showSendToCollegueModal &&
          <SendToCollegueModal
            showErrorMessage={showErrorMessage}
            onSubmit={handleSubmit}
            onClose={onCloseHandler}
            status={status}
            statusMessage={statusMessage} />
        }
      </div>}
    </>
  )
}

export default CompareSimilarOptions
