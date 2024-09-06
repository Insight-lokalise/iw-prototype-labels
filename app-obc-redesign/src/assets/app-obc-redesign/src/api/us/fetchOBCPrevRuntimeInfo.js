import axios from 'axios';

export default function fetchOBCPrevRunTimeInfo(catalogId) {
	return axios.get(`obcHistory/${catalogId}`)
		.catch((error) => {
			console.warn(`Failed to get prev runtime info: ${error}`);
			throw error;
		});
}
