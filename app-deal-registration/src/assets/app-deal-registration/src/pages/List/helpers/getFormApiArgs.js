export default function getFormApiArgs({
	selectedCountry,
	selectedManufacturer,
	selectedProgram
}) {
	return {
		manufacturer: selectedManufacturer.manufacturer,
		program: selectedProgram.split('-').join('%20'),
		salesAreaId: selectedCountry.salesAreaId
	}
}
