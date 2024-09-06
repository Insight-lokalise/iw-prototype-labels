import {rest} from 'msw'
import {setupServer} from 'msw/node'
import { SERVICES_DOMAIN } from '../constants'

//todo: remove once CORS issue is resolved and safe to remove SERVICES_DOMAIN
const SERVICES_DOMAIN_MOCK = SERVICES_DOMAIN ? SERVICES_DOMAIN : "https://undefined"

const server = setupServer(

  rest.get("*", (req, res, ctx) => {
    console.warn(`Please setup API handler for URL ${req.url.toString()}`)
    return res(ctx.status(500), ctx.json({error: `Please setup API handler for URL ${req.url.toString()}`}))
  }),

  rest.post(`${SERVICES_DOMAIN_MOCK}/api/reporting/invoice`, (req, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      "pagination":{
         "currentPage":1,
         "pageCount":1,
         "totalRecords":5
      },
      "invoices":[
         {
            "header":{
               "id":1,
               "accountName":"WEB TEST I CHANGED THE NAME",
               "accountNumber":"10285059",
               "createdOn":"04-Mar-2022",
               "po":"TEST TERMS",
               "poRelease":"88888",
               "invoiceStatus":"Open",
               "orderNumber":"0327567196",
               "invoiceNumber":"917637894",
               "total":"8.81"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":"",
                           "diversityPartnerId":null,
                           "sellRequirement":null
                        },
                        "imageURL":"https://cdn.cnetcontent.com/0b/dc/0bdc1539-11d6-4790-91ce-82eeb4228f33.jpg",
                        "materialInfo":{
                           "active":null,
                           "customDescription":null,
                           "description":"BELKIN WIRED ERGONOMIC MOUSE - MOUSE - USB - B2B     ",
                           "manufacturerPartNumber":"F5M010QBLK",
                           "materialId":"F5M010QBLK",
                           "nonShipabble":true,
                           "unitPrice":8.81
                        },
                        "quantity":1.0,
                        "sapLineItemNumber":"10"
                     }
                  ],
                  "summary":{
                     "ewrFee":null,
                     "gstHstTaxCost":null,
                     "pstTaxCost":null,
                     "shippingCost":null,
                     "subTotal":null,
                     "taxCost":null,
                     "totalCost":8.81
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         },
         {
            "header":{
               "id":2,
               "accountName":"WEB TEST I CHANGED THE NAME",
               "accountNumber":"10285059",
               "createdOn":"04-Mar-2022",
               "po":"TEST IN",
               "poRelease":" ",
               "invoiceStatus":"Open",
               "orderNumber":"0327567199",
               "invoiceNumber":"917637895",
               "total":"23.37"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":"",
                           "diversityPartnerId":null,
                           "sellRequirement":null
                        },
                        "imageURL":"https://cdn.cnetcontent.com/0b/dc/0bdc1539-11d6-4790-91ce-82eeb4228f33.jpg",
                        "materialInfo":{
                           "active":null,
                           "customDescription":null,
                           "description":"BELKIN WIRED ERGONOMIC MOUSE - MOUSE - USB - B2B     ",
                           "manufacturerPartNumber":"F5M010QBLK",
                           "materialId":"F5M010QBLK",
                           "nonShipabble":true,
                           "unitPrice":8.81
                        },
                        "quantity":1.0,
                        "sapLineItemNumber":"10"
                     }
                  ],
                  "summary":{
                     "ewrFee":null,
                     "gstHstTaxCost":null,
                     "pstTaxCost":null,
                     "shippingCost":null,
                     "subTotal":null,
                     "taxCost":null,
                     "totalCost":23.37
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         },
         {
            "header":{
               "id":3,
               "accountName":"WEB TEST I CHANGED THE NAME",
               "accountNumber":"10285059",
               "createdOn":"02-Mar-2022",
               "po":"56165495",
               "poRelease":" ",
               "invoiceStatus":"Open",
               "orderNumber":"0326772902",
               "invoiceNumber":"917637888",
               "total":"83.36"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":"",
                           "diversityPartnerId":null,
                           "sellRequirement":null
                        },
                        "imageURL":"image.not.available",
                        "materialInfo":{
                           "active":null,
                           "customDescription":null,
                           "description":"DELL DOCK- WD19 130W POWER DELIVERY - 18",
                           "manufacturerPartNumber":"210-ARIQ-NVIDIA",
                           "materialId":"210-ARIQ-NVIDIA",
                           "nonShipabble":true,
                           "unitPrice":202.57
                        },
                        "quantity":1.0,
                        "sapLineItemNumber":"20"
                     }
                  ],
                  "summary":{
                     "ewrFee":null,
                     "gstHstTaxCost":null,
                     "pstTaxCost":null,
                     "shippingCost":null,
                     "subTotal":null,
                     "taxCost":null,
                     "totalCost":83.36
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         },
      ]
   })
  )),

)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { rest, server };
