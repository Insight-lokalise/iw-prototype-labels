/**
 * transform manufacturer name to lowercase, replace spaces with dashes and 
 * remove all special characters for mapping to valid logo image filenames in DAM
 *
 * @param manufacturer {Object} manufacturer object with name
 *
 * @returns {string} image path to DAM
 **/
export default function getLogoUrl(manufacturer) {
  if(!manufacturer.name)
    return ''

  const logoUrl = manufacturer.name.toLowerCase().replaceAll(' ', '-').replace(/[^a-zA-Z\-]/g, "")
  return `/content/dam/insight-web/sitesections/sla/${logoUrl}.png`
}
