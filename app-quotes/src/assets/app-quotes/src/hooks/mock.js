export const quoteMock = {
  quoteDetails: {
    header: {
      accountName: 'WEB Test I changed the name',
      documentType: 'Quote',
      quote_number: 1234567890,
      quote_name: 'to be added',
      createdOn: 1561939200000,
      created_by: 'Bill Smith',
      expires: 1571616000000,
      salesDocumentNumber: 327564547,
      referenceNumber: 123456789,
      isConverted: false,
    },
    shoppingRequest: {
      soldTo: {
        salesAreaId: 1,
        currency: 'USD',
        id: 10285059,
      },
      cart: {
        summary: {
          pstTaxCost: 0,
          shippingCost: 0,
          gstHstTaxCost: 0,
          subTotal: 41.36,
          taxCost: 0,
          ewrFee: 0,
          totalCost: 41.36,
        },
        cartItems: [
          {
            quantity: 1,
            sapLineItemNumber: '000010',
            cartItemMetaData: {
              countryOfUsage: 'US',
              diversityPartnerId: '',
              sellRequirement: [
                {
                  name: 'CUSTOMER_QUOTE_NO',
                },
                {
                  name: 'CONTACT_EMAIL_2',
                },
                {
                  name: 'CONTACT_EMAIL_3',
                },
                {
                  name: 'CONTACT_EMAIL_4',
                },
                {
                  name: 'LICENSE',
                  value: '3eddasddqwe',
                },
                {
                  name: 'DEAL_REG_ID',
                },
                {
                  name: 'CONTACT_EMAIL',
                  value: 'cesuser@mailinator.com',
                },
                {
                  name: 'CONTACT_NAME',
                  value: 'ces2 user6',
                },
                {
                  name: 'CONTACT_PHONE',
                  value: '09123456781',
                },
                {
                  name: 'PCN_NO',
                  value: '12345678899',
                },
                {
                  name: 'AUTHORIZATION',
                  value: '1213221',
                },
              ],
              contractReportingField: [],
            },
            materialInfo: {
              description:
                'C2G 8in DisplayPort to DVI-D (Single-Link) Adapter Converter - M/F - video adapter',
              materialId: '54321',
              manufacturerPartNumber: '54321',
              unitPrice: 41.36,
              active: false,
              customDescription: '',
              nonShipabble: false,
            },
            imageURL:
              'https://cdn.cnetcontent.com/81/ea/81eaf60c-99fe-46d0-a599-6e0c17f7ca8e.jpg',
          },
        ],
      },
      billing: {
        address: {
          poBoxZipCode: '',
          zipCode: '85284-1026',
          poBox: '',
          address3: '',
          address2: '',
          city: 'TEMPE',
          address1: '1305 W AUTO DR',
          county: '',
          zipExt: '',
          state: 'AZ',
          region: '',
          countryId: 'US',
        },
        companyName: 'WEB Test I changed the name',
        phone: '09123456781',
        payment: {
          poReleaseNumber: '',
          poNumber: '1234',
          option: '2040',
        },
        id: 10285059,
        attentionLine: 'Joe Tester',
      },
      shipping: {
        shippingNotes: '',
        carrier: {
          description: 'Ground',
          option: '50',
        },
        address: {
          poBoxZipCode: '',
          zipCode: '85284-1026',
          poBox: '',
          address3: '',
          address2: '',
          city: 'TEMPE',
          address1: '1305 W AUTO DR',
          county: '',
          zipExt: '',
          state: 'AZ',
          region: '',
          countryId: 'US',
        },
        companyName: 'WEB Test I changed the name',
        phone: '09123456781',
        id: 10285059,
        attentionLine: 'Joe Tester',
      },
    },
  },
}

export const mockAddresses = [
  {
    id: 1,
    name: 'Bill Smith',
    company: "Bill's Construction Supply",
    lineOne: '3921 E MAIN ST',
    lineTwo: '#1234',
    city: 'PHOENIX',
    state: 'AZ',
    zip: '85044-6633',
    country: 'US',
  },
  {
    id: 2,
    name: 'Bill Smith',
    company: "Bill's Construction Supply",
    lineOne: '3921 E MAIN ST',
    lineTwo: '#1234',
    city: 'PHOENIX',
    state: 'AZ',
    zip: '85044-6633',
    country: 'US',
  },
  {
    id: 3,
    name: 'Bill Smith',
    company: "Bill's Construction Supply",
    lineOne: '3921 E MAIN ST',
    lineTwo: '#1234',
    city: 'PHOENIX',
    state: 'AZ',
    zip: '85044-6633',
    country: 'US',
  },
]
