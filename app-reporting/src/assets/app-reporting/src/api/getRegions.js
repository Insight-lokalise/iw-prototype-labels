import axios, { GET } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';
const {API_WARNINGS} = REPORTING_TEXTS;

let cachedResponse = null;

export const getRegions = async () => {
	if (!cachedResponse) {
		try {
			const {data} = await axios({
				method: GET,
				url: API_ENDPOINTS.getRegions
			})
			cachedResponse = data;
		} catch (err) {
			console.warn(API_WARNINGS.FAILED_TO_REGIONS, err);
		}
	}
	return cachedResponse;
}