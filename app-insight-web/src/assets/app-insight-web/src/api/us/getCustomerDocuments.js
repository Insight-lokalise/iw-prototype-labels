import axios from 'axios'

const CUSTOMER_DOCUMENTS_URL = '/insightweb/endUser/clientDocuments'


export default function getCustomerDocuments() {
    const timestamp = new Date().getTime()
    return axios
      .get(`${CUSTOMER_DOCUMENTS_URL}?q=${timestamp}`)
      .catch(error => {
        console.warn('Failed to fetch customer documents', error)
        throw error
      })
      .then(({data}) => data.reduce((acc, {docDescription:description, docId: id, docTitle: title, path: href, type, ...rest}) => acc.concat(
        [{
          description,
          id,
          title,
          type: type.toLocaleLowerCase(),
          href,
          ...rest,
        }]
      ),[]))

}
