import axios, { POST } from './axiosConfig';
import { API_ENDPOINTS } from '../constants';
import { REPORTING_TEXTS } from '../texts';
const {API_WARNINGS} = REPORTING_TEXTS;

export const getHierarchyTree = async (payload) => {
	try {
		const {data} = await axios({
			method: POST,
			url: API_ENDPOINTS.getHierarchyTree,
			data: payload
		})
		return data;
	} catch (err) {
		console.warn(API_WARNINGS.FAILED_TO_FETCH_HIERARCHY, err);
	}
}