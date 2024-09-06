import axios, { GET } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';

let cachedResponse = null;

export const getReportsList = async () => {
	if (!cachedResponse) {
		try {
			cachedResponse = await axios({
				method: GET,
				url: API_ENDPOINTS.viewReportsList,
			})
		} catch (err) {
			console.warn(`${REPORTING_TEXTS.FAILED_REPORTS_LIST}: `, err);
		}
	}

	return cachedResponse;
}
