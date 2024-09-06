import React  from  'react'

import { getSalesAreaData, getTnCData, publishDeleteTnCData, setDefaultTerm } from '@api'

import { DISPATCH_TYPES } from './constants'

export default function useDispatch(dispatch) {
  const getSalesAreaStart = () => dispatch({ type: DISPATCH_TYPES.GET_SALES_AREA })
  const getTnCStart = () => dispatch({ type: DISPATCH_TYPES.GET_TNC })
  const getTnCFailure = payload => dispatch({ type: DISPATCH_TYPES.GET_TNC_FAILURE, payload })
  const getSalesAreaFailure = payload => dispatch({ type: DISPATCH_TYPES.GET_SALES_AREA_FAILURE, payload })
  const setDefaultTNC = payload => dispatch({ type: DISPATCH_TYPES.SET_DEFAULT_TERM, payload })
  const setDefaultTNCFailure = () => dispatch({ type: DISPATCH_TYPES.SET_DEFAULT_TERM_FAILURE })
  const setFormValues = payload => dispatch({ type: DISPATCH_TYPES.SET_FORM_VALUES, payload })
  const setNewTnC = payload => dispatch({ type: DISPATCH_TYPES.SET_NEW_TNC, payload })
  const setPublishDeleteTNC = payload => dispatch({ type: DISPATCH_TYPES.SET_PUBLISH_DELETE_TNC, payload })
  const setPublishDeleteTNCFailure = () => dispatch({ type: DISPATCH_TYPES.SET_PUBLISH_DELETE_TNC_FAILURE })
  const setSalesAreaStart = payload => dispatch({ type: DISPATCH_TYPES.SET_SALES_AREA, payload })
  const setSelectedSalesArea = payload => dispatch({ type: DISPATCH_TYPES.SET_SELECTED_SALES_AREA, payload })
  const setTnC = payload => dispatch({ type: DISPATCH_TYPES.SET_TNC, payload })
  const setTnCToUpdate = payload => dispatch({ type: DISPATCH_TYPES.SET_TNC_TO_UPDATE, payload })
  const setContent = payload => dispatch({ type: DISPATCH_TYPES.SET_CONTENT, payload })

  async function getTnCs(salesArea) {
    getTnCStart()
    const { data, success } = await getTnCData(salesArea)
    if (success) {
      setNewTnC(false)
      setTnC(data)
    } else {
      getTnCFailure(data)
    }
  }

  async function publishDeleteTnC(isPublish, termId, revisionId) {
    const { data, success } = await publishDeleteTnCData(isPublish, termId, revisionId)
    const dispatchMethod = success === true
      ? setPublishDeleteTNC
      : setPublishDeleteTNCFailure

    dispatchMethod(data)
    return { data, success }
  }

  async function setDefaultTnC(selectedSalesArea, termId) {
    const { data, success } = await setDefaultTerm(selectedSalesArea, termId)
    const dispatchMethod = success === true
      ? setDefaultTNC
      : setDefaultTNCFailure

    dispatchMethod(data.success)
    return { data, success }
  }


  async function getSalesArea() {
    getSalesAreaStart()
    const { data, success } = await getSalesAreaData()
    if (success) {
      setSalesAreaStart(data)
    } else {
      getSalesAreaFailure(data)
    }
  }


  return {
    getSalesArea,
    getTnCs,
    publishDeleteTnC,
    setDefaultTnC,
    setFormValues,
    setSelectedSalesArea,
    setNewTnC,
    setTnCToUpdate,
    setContent,
  }
}
