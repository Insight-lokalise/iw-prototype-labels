export default function populateRepInfo({
	repEmail = '',
	repId = '',
	repName = '',
	repPhone = '',
	repPhoneExt = ''
}) {
	return {
		'repInfo-repEmail': repEmail,
		'repInfo-repID': repId,
		'repInfo-repName': repName,
		'repInfo-repPhone': repPhone,
		'repInfo-repPhoneExt': repPhoneExt
	}
}
