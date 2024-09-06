export const NA_SALES_ORG_TO_ID_MAP = {
	'2400': 1,
	'2500': 2,
	'4100': 3,
	'6100': 4,
	'6200': 5,
	'6300': 6,
	'6500': 7,
	'6600': 8
}
export const EMEA_SALES_ORG_TO_ID_MAP = {
  '7000': 9,
  '7100': 10,
  '7200': 11,
  '7300': 12,
  '7400': 13,
  '7500': 14,
  '7600': 15,
  '7700': 16,
  '7800': 17,
  '8000': 18,
  '8100': 19,
  '8200': 20,
  '8300': 21,
  '8400': 22
}
export const SALES_ORG_TO_ID_MAP = {
  ...NA_SALES_ORG_TO_ID_MAP,
  ...EMEA_SALES_ORG_TO_ID_MAP
}
export const SALES_ORGS = Object.keys(SALES_ORG_TO_ID_MAP)
export const FORM_SALES_ORG_TO_ID_MAP = SALES_ORGS.reduce((acc, org) => {
	// TODO: remove the hard coded org value from location.js
	acc[org] = SALES_ORG_TO_ID_MAP[org]
	return acc
}, {})

export const SALES_ID_TO_ORG_MAP = SALES_ORGS.reduce(
	(acc, org) => ({
		...acc,
		[SALES_ORG_TO_ID_MAP[org]]: org,
	}),
	{}
)
