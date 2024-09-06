export default async function getCountries() {
	const response = await fetch('/dealreg/countries/1')
	return response.json()
}

export async function getCountryById(salesOrgId) {
  const response = await fetch(`/dealreg/countryById/${salesOrgId}`)
  return response.json()
}

const processResp = response => { return response.reduce((countries, country) => ({...countries, [country.salesOrg] : country.salesAreaId}), { }) }

let salesOrgMap

export async function getSalesOrgMap() {
  if (!salesOrgMap) {
    salesOrgMap = await getCountries().then(processResp)
  }
  return salesOrgMap
}
