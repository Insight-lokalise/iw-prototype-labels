import { SALES_ORG_TO_ID_MAP } from 'constants'
import { getSalesOrgMap } from '@api'

export default async function getAccountData(soldTo = 10283501, salesOrg) {
	const salesOrgMap = await getSalesOrgMap()

	const salesOrgId =
		salesOrgMap[salesOrg] === undefined
			? SALES_ORG_TO_ID_MAP[salesOrg]
			: salesOrgMap[salesOrg]
	const response = await fetch(`/dealreg/account/${salesOrgId}/${soldTo}`)
	return response.json()
}
