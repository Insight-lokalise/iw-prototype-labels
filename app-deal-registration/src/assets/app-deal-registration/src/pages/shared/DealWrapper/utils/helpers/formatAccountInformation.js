import { uppercaseFirst } from 'lib'
import createErrorBuffer from './createErrorBuffer'

const populateDropdowns = (billTo, contact, shipTo) => ({
	billToNumber: billTo,
	contactNumber: contact,
	shipToNumber: shipTo
})

const populateRepValues = ({
	repEmail = '',
	repId = '',
	repName = '',
	repPhone = '',
	repPhoneExt = ''
}) => ({
	'repInfo-repEmail': repEmail,
	'repInfo-repID': repId,
	'repInfo-repName': repName,
	'repInfo-repPhone': repPhone,
	'repInfo-repPhoneExt': repPhoneExt
})

const populateAccountValues = accountAddress => {
	return Object.keys(accountAddress).reduce((acc, key) => {
		const prefix = 'accountInfo-account'
		const name = key !== 'street' ? uppercaseFirst(key) : 'Address'
		return { ...acc, [`${prefix}${name}`]: accountAddress[key] }
	}, {})
}

export default function formatAccountInfomation({
	accountAddress,
	billToNumbers,
	contactNumbers,
	shipToNumbers,
	...repInfo
}) {
	const populated = populateDropdowns(billToNumbers, contactNumbers, shipToNumbers)
	const newValues = {
		...populateRepValues(repInfo),
		...populateAccountValues(accountAddress)
	}
	const errorBuffer = createErrorBuffer(newValues)
	return { errorBuffer, newValues, populated }
}
