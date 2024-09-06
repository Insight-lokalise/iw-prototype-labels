export default function generateInitiallyExpandedIds(licenseAgreements) {
 // return licenseAgreements.reduce((acc, curr) => [...acc, curr.name], [])
   return licenseAgreements.length > 0 && licenseAgreements[0].name || ""
}
