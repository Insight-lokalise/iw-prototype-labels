import axios, { GET } from './axiosConfig';

export const invokeReportUrl = async (url,errMsg) => {
  try {
    await axios({
      method: GET,
      url,
    })
  } catch (err) {
    console.warn(`${errMsg}: `, err);
    throw new Error();
  }
}