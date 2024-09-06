import axios from 'axios'

export function fetchSecondaryNavData(componentPath) {
  return axios.get(`/aemServices/exporter?componentPath=${componentPath}`).catch(error => {
    console.warn('Failed to load secondary navigation data from AEM dialog', error)
    throw error
  })
}
