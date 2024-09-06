import React, { useReducer, createContext } from 'react'
import PropTypes from 'prop-types';

import {
  SET_OBCINFO,
  SET_TABCHANGE,
  SET_DELIVERYINFO,
  SET_CONTRACT_INFO,
  updateContracts,
  updateOccurrences,
  updateDelivery,
  updateOBCInfo,
  updateTabChange,
  updateClientConfigs,
  updateContractInfo
} from '../duck'

const AppContext = createContext({
  setupDeliveryInfo: {
    eclassCode: '',
    contractList: null,
    consortiaAgreement: null,
    delimiter: "",
    doubleQuote: false,
    fileExtention: "",
    frequency: "",
    hmce: false,
    ignoreMaterialStatus: "",
    imageProcessing: false,
    languages: "",
    scheduledRunTime: "",
    scheduledStartDate: "",
    timeZone: "",
    timeZoneRegion: "",
    specifications: false,
    runDay: "",
    unspscToCategoryVersion: "",
    ftpRemoteHost: "",
    ftpRemotePort: "",
    ftpRemoteUser: "",
    ftpRemotePassword: "",
  },
  allowEditSoldTo: false,
  catalogId: null,
  webGroupId: "",
  soldTo: "",
  salesOrg: "",
  userEmail: "",
  selectedTabId: "",
  stepCompleted: 0,
  eComServiceUrl: "",
  contractInfo:{},
  updateSelectedContract: ()=>{},
  updateOccurrencesInfo: ()=>{},
  updateDeliveryFields: ()=>{},
  updateClientInfo: ()=>{},
  onSelectedTabChange: ()=>{},
  updateContractInfoData:()=>{}
});

export default AppContext

export function AppProvider({ children }) {

  const [state, dispatch] = useReducer(reducer, {
    setupDeliveryInfo: {
      contractList: null,
      consortiaAgreement: null,
      delimiter: "",
      doubleQuote: false,
      eclassCode: "",
      fileExtention: "",
      frequency: "",
      hmce: false,
      ignoreMaterialStatus: "",
      imageProcessing: false,
      language:'en',
      scheduledRunTime: "",
      scheduledStartDate: "",
      timeZone: "",
      timeZoneRegion: "",
      specifications: false,
      unspscToCategoryVersion: ""
    },
    allowEditSoldTo: true,
    catalogId: null,
    webGroupId: "",
    soldTo: "",
    salesOrg: "",
    userEmail: "",
    selectedTabId: "",
    stepCompleted: 0,
    eComServiceUrl: "",
    contractInfo: {}
  })

  function updateSelectedContracts({contracts, consortiaAgreement}) {
    return dispatch(updateContracts(contracts, consortiaAgreement))
  }
  
  function updateOccurrencesInfo(schedule) {
    return dispatch(updateOccurrences(schedule))    
  }
  
  function updateDeliveryFields(fields) {
    return dispatch(updateDelivery(fields))
  }
  
  function updateClientInfo(data) {    
    return dispatch(updateOBCInfo(data))
  }  
  
  function onSelectedTabChange(id) {
    return dispatch(updateTabChange(id))
  }

  function updateClientConfigFields(data) {
    return dispatch(updateClientConfigs(data))
  }

  function updateContractInfoData(data) {
    return dispatch(updateContractInfo(data))
  }

  const actions = {
    updateSelectedContracts,
    updateOccurrencesInfo,
    updateDeliveryFields,
    updateClientInfo,
    updateClientConfigFields,
    onSelectedTabChange,
    updateContractInfoData
  }

  return <AppContext.Provider value={{...state, ...actions}}>{children}</AppContext.Provider>
  
}

function reducer(state, { type, payload }) {
  switch (type) {
    case SET_OBCINFO:
    return { ...state, ...payload}
    case SET_CONTRACT_INFO:
    return {...state, contractInfo: payload}
    case SET_TABCHANGE:
    return { ...state, stepCompleted: payload.step, selectedTabId: payload.id }
    case SET_DELIVERYINFO:
    return {
        ...state,
        setupDeliveryInfo: {
        ...state.setupDeliveryInfo,
        ...payload
      }
    }
    default:
    return state
  }
}

AppProvider.propTypes = {
  children: PropTypes.element.isRequired
}
