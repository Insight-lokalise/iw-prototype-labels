import axios, { GET } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';

let cachedResponse;

export const getAccountToolsMenuDetails = () => {
	if (!cachedResponse) {
		cachedResponse = axios({
			method: GET,
			url: API_ENDPOINTS.getAccountToolsMenuDetails,
		}).catch((error) => {
			console.warn(`${REPORTING_TEXTS.FAILED_ACCOUNT_TOOLS_DATA}: `, error);
			// TODO - Check if Custom error is required here
			throw error
		}).then((response) => {
			const { reportsObj } = response.data;
			return reportsObj;
		});
	}
	return cachedResponse;
}