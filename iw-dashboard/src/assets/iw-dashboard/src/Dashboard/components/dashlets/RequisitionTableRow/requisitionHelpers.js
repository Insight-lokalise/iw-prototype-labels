import RequisitionTableRowContainer from '../../../containers/dashlets/RequisitionTableRow'
import TableSubHeader from '../TableSubHeader'

export default function transformRequisitonDashletData(requisitionDashletData, rowDataCreator) {
  const dashletRequisitionHistoryResults = requisitionDashletData.dashletRequisitionHistoryResults || []
  const metaData = {
    comments: '',
    discontinueMaterialIdExist: false,
    loginProfileId: requisitionDashletData.webLoginProfileId,
  }
  const sessionWebGroupId = requisitionDashletData.webGroupId
  const transformedDataOutput = []

  dashletRequisitionHistoryResults.forEach(webGroup => {
    // show webGroup subheader if there are multiple webgroups
    transformedDataOutput.push({
      rowComponent: TableSubHeader,
      rowComponentProps: createSubHeaderRowComponentProps(webGroup, sessionWebGroupId === webGroup.webGroupId),
    })

    webGroup.dashboardRequisitionSearchResults.forEach(requisition => {
      transformedDataOutput.push({
        rowComponent: RequisitionTableRowContainer,
        rowComponentProps: {
          requisitionParams: createRequisitionParams(requisition, metaData),
          rowData: rowDataCreator(requisition),
        },
      })
    })
  })

  return transformedDataOutput
}

function createSubHeaderRowComponentProps(webGroup, isSessionWebGroup) {
  const { webGroupName, webGroupId, countryCode } = webGroup
  return {
    webGroupName,
    webGroupId,
    countryCode,
    ...(isSessionWebGroup ? { subHeaderLink: { href: 'ar/reqHistory', text: 'View all' } } : null),
  }
}

function createRequisitionParams(requisition, metaData) {
  return {
    ...metaData,
    customerNumber: requisition.webGroup,
    lastApprover: requisition.lastApprover,
    paymentType: requisition.paymentType,
    purchaseRequestId: requisition.purchaseRequestId,
    referenceNumber: requisition.referenceNumber,
    requestorGroupId: requisition.requestorGroupId,
  }
}
