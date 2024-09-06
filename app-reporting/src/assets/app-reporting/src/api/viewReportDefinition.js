import axios, { GET, POST } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';

export const getReportDefinition = async (trackingNumber) => {
	try {
		const { data } = await axios({
			method: GET,
			url: `${API_ENDPOINTS.openReportDefinition}/${trackingNumber}`,
		})
		return data;
	} catch (err) {
		console.warn(REPORTING_TEXTS.FAILED_TO_FETCH_REPORT_DEFINITION, err);
    throw new Error();
	}
}

export const updateReportEmail = async (payload) => {
	try {
		const { data } = await axios({
			method: POST,
			url: API_ENDPOINTS.updateReportEmail,
      data: payload
		})
		return data;
	} catch (err) {
		console.warn(REPORTING_TEXTS.FAILED_TO_UPDATE_REPORT_EMAIL, err);
    throw new Error();
	}
}