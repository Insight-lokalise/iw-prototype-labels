import axios, { POST } from './axios'
import { createPayloadForCompareApi } from '../helpers/createPayloadForCompareApi'
import getSessionUser from './getSessionUser'

export const sendToColleague = async (values) => {
  try {
    const headerInfo = await getSessionUser()
    const { params } = await createPayloadForCompareApi()
    const delimiter = values.recipentsEmail.split("").find((char) => !/[a-zA-Z]/.test(char) && char !== "@" && char !== "." && !/\d/.test(char))
    const recipentsEmailData = values.recipentsEmail.split(delimiter)
    const apiData = {
      target: recipentsEmailData,
      type: "COMPARE",
      body: {
        locale: headerInfo.locale,
        subject: "Search Compare products",
        domainUrl: headerInfo.domainUrl,
        senderName: values.userName,
        comments: values.yourComments,
        content: {
          ...params
        }
      }
    }
    const response = await axios({
      method: POST,
      url: '/insightweb/endUser/sendColleague',
      data: apiData

    })
    if (!response) throw new Error('Error to send data to colleague via email')
    return response
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Failed to send data to colleague email`, err)
    throw err
  }
}


export default sendToColleague
