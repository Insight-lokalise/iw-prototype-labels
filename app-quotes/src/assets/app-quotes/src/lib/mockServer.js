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
  rest.post(`${SERVICES_DOMAIN_MOCK}/api/reporting/quote/top5`, (req, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      "pagination":{
         "currentPage":1,
         "pageCount":1,
         "totalRecords":5
      },
      "quotes":[
         {
            "header":{
               "accountName":null,
               "createdBy":" ",
               "createdOn":"10-Feb-2022",
               "documentType":null,
               "expires":"12-Mar-2022",
               "isConverted":false,
               "quoteName":" ",
               "quoteNumber":"0219320941",
               "referenceNumber":"61271353",
               "salesDocumentNumber":"0219320941"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":" ",
                           "diversityPartnerId":"",
                           "sellRequirement":[
                              {
                                 "name":"",
                                 "value":""
                              }
                           ]
                        },
                        "imageURL":"https://cdn.cnetcontent.com/45/2b/452b4702-54f9-4137-adab-a54999b346d8.jpg",
                        "materialInfo":{
                           "active":true,
                           "customDescription":"",
                           "description":"TARGUS TRADITIONAL NOTEPAC NOTEBOOK CARRYING CASE     ",
                           "manufacturerPartNumber":"OCN1",
                           "materialId":"OCN1",
                           "nonShipabble":true,
                           "unitPrice":50.73
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
                     "totalCost":50.73
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         },
         {
            "header":{
               "accountName":null,
               "createdBy":" ",
               "createdOn":"10-Feb-2022",
               "documentType":null,
               "expires":"12-Mar-2022",
               "isConverted":false,
               "quoteName":" ",
               "quoteNumber":"0219320942",
               "referenceNumber":"61271354",
               "salesDocumentNumber":"0219320942"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":" ",
                           "diversityPartnerId":"",
                           "sellRequirement":[
                              {
                                 "name":"",
                                 "value":""
                              }
                           ]
                        },
                        "imageURL":"image.not.available",
                        "materialInfo":{
                           "active":true,
                           "customDescription":"",
                           "description":"CTO RCTO QM67 UMALCDHD FCAMFPR BASE NB P",
                           "manufacturerPartNumber":"LS995AV",
                           "materialId":"LS995AV",
                           "nonShipabble":true,
                           "unitPrice":909.57
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
                     "totalCost":909.57
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         }
      ]
   })
  )),
  rest.post(`${SERVICES_DOMAIN_MOCK}/api/reporting/quote/quoteSearch`, (req, res, ctx) => res(
   ctx.status(200),
   ctx.json({
      "pagination":{
         "currentPage":2,
         "pageCount":5,
         "totalRecords":25
      },
      "quotes":[
         {
            "header":{
               "accountName":null,
               "createdBy":" ",
               "createdOn":"10-Feb-2022",
               "documentType":null,
               "expires":"12-Mar-2022",
               "isConverted":false,
               "quoteName":" ",
               "quoteNumber":"0219320941",
               "referenceNumber":"61271353",
               "salesDocumentNumber":"0219320941"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":" ",
                           "diversityPartnerId":"",
                           "sellRequirement":[
                              {
                                 "name":"",
                                 "value":""
                              }
                           ]
                        },
                        "imageURL":"https://cdn.cnetcontent.com/45/2b/452b4702-54f9-4137-adab-a54999b346d8.jpg",
                        "materialInfo":{
                           "active":true,
                           "customDescription":"",
                           "description":"TARGUS TRADITIONAL NOTEPAC NOTEBOOK CARRYING CASE     ",
                           "manufacturerPartNumber":"OCN1",
                           "materialId":"OCN1",
                           "nonShipabble":true,
                           "unitPrice":50.73
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
                     "totalCost":50.73
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         },
         {
            "header":{
               "accountName":null,
               "createdBy":" ",
               "createdOn":"10-Feb-2022",
               "documentType":null,
               "expires":"12-Mar-2022",
               "isConverted":false,
               "quoteName":" ",
               "quoteNumber":"0219320942",
               "referenceNumber":"61271354",
               "salesDocumentNumber":"0219320942"
            },
            "shoppingRequest":{
               "billing":null,
               "cart":{
                  "cartItems":[
                     {
                        "cartItemMetaData":{
                           "contractReportingField":null,
                           "countryOfUsage":" ",
                           "diversityPartnerId":"",
                           "sellRequirement":[
                              {
                                 "name":"",
                                 "value":""
                              }
                           ]
                        },
                        "imageURL":"image.not.available",
                        "materialInfo":{
                           "active":true,
                           "customDescription":"",
                           "description":"CTO RCTO QM67 UMALCDHD FCAMFPR BASE NB P",
                           "manufacturerPartNumber":"LS995AV",
                           "materialId":"LS995AV",
                           "nonShipabble":true,
                           "unitPrice":909.57
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
                     "totalCost":909.57
                  }
               },
               "shipping":null,
               "soldTo":null
            }
         }
      ]
   })
 )),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { rest, server };
