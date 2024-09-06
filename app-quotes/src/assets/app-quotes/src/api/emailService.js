import axios, { POST } from './axiosConfig'
import { getAccountInformation } from './getData'

export const emailService = async ({ name, emails, comment, quoteId }) => {
  const { webGroupId, account, locale, salesOrg } =
    await getAccountInformation()
  try {
    // no return value
    await axios({
      method: POST,
      url: `api/reporting/quote/${quoteId}/email`,
      data: {
        name: name,
        emails: [...emails],
        comment: comment || null,
      },
      params: {
        wgId: webGroupId,
        soldto: account.soldToId,
        salesorg: salesOrg,
        locale,
      },
    })
  } catch (err) {
    if (err.response?.data?.message) err = new Error(err.response.data.message)
    console.warn(`Error with email service`, err)
    throw err
  }
}
