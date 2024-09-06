import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Loading } from '@insight/toolkit-react'

import { getCountryById, getSalesOrgMap, getActiveFormById, getActiveForm, isValidResponse, updateDeal } from '@api'
import { Deal } from '@components'
import { sleep } from '@lib'
import { convertLegacyFields, convertToSubmitStructure } from '@services/builder'

import { createSubmissionArgs, formatPathname, formatClientlinkArgs, getRedirectLink } from './helpers'
import SubmissionsMessage from './SubmissionsMessage'
import FormNotFound from '../Error/FormNotFound'

export default function Submission({ display, emitter, location, purpose }) {
  const purposeState = purpose.getPurpose()
  const [form, setForm] = useState(purposeState.selectedForm)
  const [isLoading, setLoading] = useState(true)
  const [hasSubmitted, setSubmitted] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showError, setShowError] = useState(false)

  const entryContext = formatPathname(location, purposeState)
  const isLocal = entryContext.entrypoint === 'local'
  const isClientLink = entryContext.entrypoint === 'clientlink'
  // We need to check if this is a legacy form or not so we can save it and update the db.

  const onClose = (event) => {
    if (!hasSubmitted) {
      event.preventDefault();
      event.returnValue = `Warning: you are about to close this tab without submitting your form. Are you sure you want to do this?`
    }
  }

  useEffect(() => {
    window.onbeforeunload = onClose

    return () => {
      window.onbeforeunload = () => {}
    }
  }, [])

  useEffect(() => {
    if (hasSubmitted) {
      window.onbeforeunload = () => {}
    }
  }, [hasSubmitted])

  useEffect(() => {
    const { entrypoint, pathArgs } = entryContext
    const fetch = async () => {
      if (!form) {
        const apiCall = isClientLink ? getActiveForm : getActiveFormById
        const formattedArgs = isClientLink ? formatClientlinkArgs(pathArgs) : pathArgs
        const response = await apiCall(formattedArgs)
        if (response && !response.error) {
          const country = await getCountryById(response.salesAreaId)
          purpose.updatePurposeKey({ key: 'selectedForm', value: response })
          setForm(prev => response)
          // populate the default value for the salesOrg
       //   const country = await getCountryById(response.salesAreaId)
          purpose.updatePurposeKey({ key: 'selectedCountry',  value: country})
          response.salesOrg = country.salesOrg
        } else {
          setShowError(true)
        }
      } else {
        // populate the default value for the salesOrg
        form.salesOrg = purpose.getPurpose().selectedCountry.salesOrg
      }
    }
    fetch()
	}, [purpose])

	useEffect(() => {
  	if (form && isLoading) {
  		setLoading(false)
    }
  }, [form])

	const onInvalid = useCallback(() => {
		display.addToast({
			color: 'warning',
			id: 'deal-submission-failure',
			text: <p>Your form has errors</p>
		})
	}, [emitter])

	const onSuccess = async values => {
		const currentPurposeState = purpose.getPurpose()
    const salesOrgMap = await getSalesOrgMap()
    const salesOrgId = salesOrgMap[values.universal.dealInfo.salesOrg]
		const submissionArgs = createSubmissionArgs(currentPurposeState, values, entryContext, salesOrgId)
		const response = await updateDeal(submissionArgs)
		if (response && !response.error) {
      setSubmitted(prev => true)
			display.addToast({
				color: 'success',
				id: 'deal-submission-success',
				text: <p>Deal submitted sucessfully</p>
			})
			await sleep(2000)
      const isEmeaDeal = currentPurposeState.selectedCountry && (currentPurposeState.selectedCountry.region === 'EMEA' || currentPurposeState.selectedCountry.region === 'EMEX')
      
      if (isLocal && !isEmeaDeal) {
        window.location = getRedirectLink(form.salesAreaId)
      } else {
        setShowMessage({dealId: response})
      }
		} else if (response.error || response.status >= 400) {
      display.addToast({
        color: 'warning',
        id: 'update-deal-failed',
        text: <p>Sorry, we couldn't update this deal.</p>
      })
    }
  }

	if (showError) {
    return <FormNotFound />
  }

	if (isLoading) {
		return <Loading />
	}

	if(showMessage && purpose.getPurpose().selectedCountry && (purpose.getPurpose().selectedCountry.region === 'EMEA' || purpose.getPurpose().selectedCountry.region === 'EMEX')) {
    return <SubmissionsMessage displayType={'emea-success'} dealId={showMessage.dealId} />
  }

	if (showMessage) {
    return <SubmissionsMessage displayType={entryContext.entrypoint} />
  }
  
  if (form.formFields && !form.formFields.custom) {
    return <p>This deal was actually created with invalid data. This shouldn't exist in prod</p>
  }

  const formFields = form.formFields.isModern ? form.formFields : convertToSubmitStructure(convertLegacyFields(form))
  const passedFields = { ...form, formFields }

	return (
  <div className="c-submission">
    <Deal
      onInvalid={onInvalid}
      onSuccess={onSuccess}
      entryContext={entryContext}
      passedFields={passedFields}
      showSubmit
    />
  </div>
  )
}
