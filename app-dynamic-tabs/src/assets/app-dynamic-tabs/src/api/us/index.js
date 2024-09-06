import axios from 'axios'

export function fetchTabsConfig(componentPath) {
  return axios.get(`/aemServices/exporter?componentPath=${componentPath}`).catch(error => {
    console.warn('Failed to load multi-slider data from AEM dialog', error)
    throw error
  })
}
