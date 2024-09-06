import {FORM_SALES_ORG_TO_ID_MAP} from 'constants'
import { parseSalesOrg } from 'pages/shared/DealWrapper/utils/helpers'

export default function formatClientlinkArgs({ salesOrg, manufacturer1, programId }) {
  const salesOrgNum = parseSalesOrg(salesOrg)
  return {
    salesAreaId: FORM_SALES_ORG_TO_ID_MAP[salesOrgNum],
    manufacturer: manufacturer1,
    program: programId,
  }
}
