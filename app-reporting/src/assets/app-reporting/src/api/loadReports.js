import axios, { GET } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';
const {API_WARNINGS} = REPORTING_TEXTS;

let cachedResponse = null;

export const loadReports = async (reportCode) => {
	try {
        const {data} = await axios({
            method: GET,
            url: API_ENDPOINTS.loadReports + reportCode
        })
        cachedResponse = data;
    } catch (err) {
        console.warn(API_WARNINGS.FAILED_TO_LOAD_REPORTS, err);
    }
	return cachedResponse;
}