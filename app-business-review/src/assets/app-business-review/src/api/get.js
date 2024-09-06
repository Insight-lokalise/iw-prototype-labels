import axios from 'axios'

export function fetchPowerBiData(reportName) {
    return axios.get(`/insightweb/pbiReport?reportName=${reportName}`).catch(error => {
      console.warn('Failed to get PowerBI data.')
      throw error
    })
  }
