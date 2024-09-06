import axios, { GET } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';

// Fetch - Report Templates, Posted Reports, Scheduled Reports
export const getReports = async () => {
  try {
    return await axios({
      method: GET,
      url: API_ENDPOINTS.viewReports,
    })
  } catch (err) {
    console.warn(`${REPORTING_TEXTS.FAILED_REPORTS}: `, err);
  }
}
