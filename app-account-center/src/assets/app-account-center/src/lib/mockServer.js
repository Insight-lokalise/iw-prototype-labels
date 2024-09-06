import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get(
    `https://undefined/insightweb/endUser/getLoginInfo/*`,
    (req, res, ctx) => res(ctx.status(200), ctx.json({ userName: 'user name' }))
  ),
  rest.get(
    `http://localhost/insightweb/endUser/getCurrentAccountDropDownDetails/*`,
    (req, res, ctx) => res(ctx.status(200), ctx.json({}))
  ),
  rest.get(
    `https://undefined/insightweb/endUser/getContactInfo/*`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          user: {
            email: 'first.last@test.com',
            firstName: 'first name',
            lastName: 'last name',
            phoneNumber: 1234567890,
            soldToNumber: 123456789,
            emailQuotes: true,
            orderQuotes: true,
            userPreferences: { email_format: 'HTML' },
          },
        })
      )
  ),
  rest.get(
    `https://undefined/insightweb/endUser/getCheckOutDefaults/*`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          defaultShipingAndBillingAddress: {
            defaultShippingAddress: {
              partnerCity: 'AUSTIN',
              partnerPhone: null,
              partnerCompany: 'NSIT Austin',
              attentionLine: null,
              partnerState: 'TX ',
              partnerZip: '78758-4411',
              partnerCounty: '',
              partnerCountry: 'US ',
              partnerAaddress1: '2525 BROCKTON DR',
              partnerName: null,
              partnerAddress3: '',
              partnerAddress2: '',
              partnerSuite: null,
            },
            defaultBillingAddress: {
              partnerCity: 'ADDISON',
              partnerPhone: '480-333-1010',
              partnerCompany: 'NSIT Addison',
              attentionLine: 'Joe Tester',
              partnerStoreId: '123',
              partnerState: 'IL',
              partnerZip: '60101-6100',
              partnerCounty: 'X',
              partnerCountry: 'US',
              partnerAaddress1: '2250 W PINEHURST BLVD',
              partnerName: null,
              partnerAddress3: '',
              partnerAddress2: '',
            },
          },
          payOptions: {
            allowedOptions: [
              {
                name: 'Terms',
                id: 1,
              },
              {
                name: 'Credit Card',
                id: 2,
              },
              {
                name: 'Procurement Card',
                id: 3,
              },
            ],
            defaultOption: 2,
          },
        })
      )
  ),
  rest.get(
    `https://undefined/insightweb/transaction/getStatesByLocale/US`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json([
          { key: 'AE', value: 'APO' },
          { key: 'AP', value: 'APO' },
          { key: 'AL', value: 'Alabama' },
        ])
      )
  ),
  rest.get(
    `https://undefined/insightweb/transaction/storedCards`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          ccStoredCards: [
            {
              storedCardId: 540249,
              lpWebLoginProfileId: 5752851,
              storedCardDesc: 'test card 1',
              storedCardHolderName: 'test 1',
              storedCardToken: '************1111',
              worldPayToken: null,
              storedCardExpMonth: 1,
              storedCardExpYear: 2023,
              storedCardType: 'VISA',
              isDefaultCard: true,
              storedCardMethodId: 2,
              storedCardPoNum: null,
              displayCardNum: '************1111',
              createdOn: 1641599695883,
              updatedOn: 1641599695883,
              exceptionExists: false,
              exceptionsList: null,
              storedCardDetailsChanged: false,
              storedCardNewExpMonth: 0,
              storedCardNewExpYear: 0,
            },
            {
              storedCardId: 540252,
              lpWebLoginProfileId: 5752851,
              storedCardDesc: 'test card 2 ',
              storedCardHolderName: 'test 2',
              storedCardToken: '************4242',
              worldPayToken: null,
              storedCardExpMonth: 1,
              storedCardExpYear: 2025,
              storedCardType: 'VISA',
              isDefaultCard: false,
              storedCardMethodId: 2,
              storedCardPoNum: null,
              displayCardNum: '************4242',
              createdOn: 1641859249713,
              updatedOn: 1641859249713,
              exceptionExists: false,
              exceptionsList: null,
              storedCardDetailsChanged: false,
              storedCardNewExpMonth: 0,
              storedCardNewExpYear: 0,
            },
          ],
          procStoredCardses: [
            {
              storedCardId: 540238,
              lpWebLoginProfileId: 5752851,
              storedCardDesc: 'Pcard MC',
              storedCardHolderName: 'Test Name',
              storedCardToken: '************4444',
              worldPayToken: null,
              storedCardExpMonth: 8,
              storedCardExpYear: 2027,
              storedCardType: 'MC',
              isDefaultCard: true,
              storedCardMethodId: 3,
              storedCardPoNum: null,
              displayCardNum: '************4444',
              createdOn: 1641400545213,
              updatedOn: 1641400545213,
              exceptionExists: false,
              exceptionsList: null,
              storedCardDetailsChanged: false,
              storedCardNewExpMonth: 0,
              storedCardNewExpYear: 0,
            },
          ],
          ccavailableInWebGroup: true,
          pcavailableInWebGroup: true,
          creditCardsAvailable: true,
          procurmentCardsAvailable: true,
          overridePaymentOption: false,
        })
      )
  ),
  rest.post(
    `https://undefined/insightweb/endUser/updateUserPersonalInfo`,
    (req, res, ctx) => res(ctx.status(200))
  ),
  rest.post(
    `https://undefined/insightweb/endUser/updateUserPreferences`,
    (req, res, ctx) => res(ctx.status(200))
  ),
  rest.post(
    `https://undefined/insightweb/endUser/updateUsername`,
    (req, res, ctx) => res(ctx.status(200), ctx.text('user name'))
  ),
  rest.post(
    `https://undefined/insightweb/endUser/updatePassword`,
    (req, res, ctx) => res(ctx.status(200))
  ),
  rest.get(
    `https://undefined/insightweb/createUser/checkLoginAvailability/amoorthi10/*`,
    (req, res, ctx) => res(ctx.status(200), ctx.text('true'))
  ),
  rest.post(
    `https://undefined/insightweb/transaction/submitContactAddress`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          nickName: null,
          creationStatusId: -5,
          creationStatusDescription: 'EXISTING_ADDRESS',
          addressData: {
            partnerNumber: '',
            attention: 'Insight Inc',
            companyName: 'insight',
            street1: '3480 LOTUS DR',
            street2: '',
            street3: '',
            city: 'PLANO',
            region: 'TX',
            postalCode: '75075-7834',
            country: 'US',
            county: 'COLLIN',
            taxJurisdiction: '4408523100',
            isSoldto: null,
            phone: null,
            ext: null,
            fax: null,
            addressInd: null,
            phoneCountryCode: 'US +1  ',
            storeId: '',
            poBox: '',
            poBoxPostalCode: '',
            poBoxCity: '',
          },
          language: '',
          partnerFunction: 21967971,
          duplicateAddress: true,
          phoneNumber: '',
          faxNumber: '',
          zip1: '',
          zip2: '',
          suggestedAddressesList: [],
          addressReadyForCreation: true,
        })
      )
  ),
  rest.get('*', (req, res, ctx) => {
    console.warn(`Please setup API handler for URL ${req.url.toString()}`)
    return res(
      ctx.status(500),
      ctx.json({
        error: `Please setup API handler for URL ${req.url.toString()}`,
      })
    )
  }),
  rest.post(
    `https://undefined/insightweb/transaction/getShippingBillingAddresses`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          shipResponse: {
            shipToBillToaddress: [
              {
                partnerFunction: 10285059,
                partnerCity: 'TEMPE',
                private: false,
                favouriteId: 0,
                partnerPhone: '480-333-1010',
                partnerCompany: 'WEB Test I changed the name',
                attentionLine: 'Joe Tester',
                favouriteLineId: 0,
                isLinked: true,
                poBox: null,
                default: null,
                partnerStoreId: '123',
                partnerState: 'AZ ',
                partnerFax: null,
                partnerZip: '85284-1026',
                partnerExt: null,
                partnerCounty: '',
                partnerCountry: 'US ',
                partnerAaddress1: '1305 W AUTO DR',
                partnerName: null,
                partnerJurisdiction: '0301302900     ',
                partnerAddress3: '',
                partnerAddress2: '',
                partnerSuite: null,
                phoneCountryCode: 'US +1  ',
                sortOrder: 0,
                favouriteName: null,
                favorite: null,
              },
              {
                partnerFunction: 40140531,
                partnerCity: 'ADDISON',
                private: false,
                favouriteId: 651380,
                partnerPhone: '480-333-1010',
                partnerCompany: 'NSIT Addison',
                attentionLine: 'Joe Tester',
                favouriteLineId: 0,
                isLinked: true,
                poBox: null,
                default: null,
                partnerStoreId: '123',
                partnerState: 'IL',
                partnerFax: null,
                partnerZip: '60101-6100',
                partnerExt: null,
                partnerCounty: 'X',
                partnerCountry: 'US',
                partnerAaddress1: '2250 W PINEHURST BLVD',
                partnerName: null,
                partnerJurisdiction: '1404300200',
                partnerAddress3: '',
                partnerAddress2: '',
                partnerSuite: null,
                phoneCountryCode: 'US +1  ',
                sortOrder: 0,
                favouriteName: null,
                favorite: null,
              },
              {
                partnerFunction: 40146719,
                partnerCity: 'BONNERS FERRY',
                private: false,
                favouriteId: 651381,
                partnerPhone: null,
                partnerCompany: 'ELK MOUNTAIN FARMS',
                attentionLine: 'DON ALLENBURG -0',
                favouriteLineId: 0,
                isLinked: true,
                poBox: null,
                default: null,
                partnerStoreId: null,
                partnerState: 'ID',
                partnerFax: null,
                partnerZip: '83805-5947',
                partnerExt: null,
                partnerCounty: 'X',
                partnerCountry: 'US',
                partnerAaddress1: '822 BUDWIESER LOOP',
                partnerName: null,
                partnerJurisdiction: '1302100000',
                partnerAddress3: '',
                partnerAddress2: '',
                partnerSuite: null,
                phoneCountryCode: 'US +1  ',
                sortOrder: 0,
                favouriteName: null,
                favorite: null,
              },
            ],
          },
        })
      )
  ),
  rest.post(
    `https://undefined/insightweb/endUser/getCurrentAccount`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          defaultSoldto: {
            exception: null,
            name_3: null,
            incoterms: ['', ''],
            name_2: null,
            isIpsEducation: false,
            userSelectedAddressType: 'USER_ENTERED_ADDRESS',
            soldToId: 10845917,
            companyName: '1065-The Westin Resort Macua',
            vatId: null,
            language: null,
            attentionLine: null,
            isPrivate: false,
            exceptionExist: false,
            poBox: null,
            isDeleted: false,
            extNumber: null,
            fiscalCode: null,
            paymentTerms: null,
            companyCode: null,
            address: {
              poBoxZipCode: '',
              zipCode: '00000',
              poBox: '',
              address3: '',
              address2: '',
              city: 'Coloane',
              address1: '1918 Estrada de Hac Sa',
              county: '',
              zipExt: '',
              state: 'MO ',
              region: '',
              countryId: 'MO ',
            },
            countryCodePhone: 'MO +   ',
            address2: '',
            customerGroup: 'Z001',
            partner_number: 10845917,
            accountGroup: null,
            addressAlreadyVerified: false,
            exceptions: null,
            messageStatus: null,
            poBoxZipCode: null,
            phoneNumber: null,
            telExt: null,
            name: '1065-The Westin Resort Macua',
            messages: null,
            faxNumber: null,
            partnerType: null,
            salesDetail: null,
            companyRegistrationNum: null,
            isPrivateShipto: 0,
            sdiNumber: null,
            taxJurisdiction: '8044600000',
            name_4: null,
          },
          soldto: {
            address: {
              poBoxZipCode: '',
              poBox: '',
              zipCode: '00000',
              address3: '',
              city: 'Coloane',
              address2: '',
              address1: '1918 Estrada de Hac Sa',
              county: '',
              zipExt: '',
              state: 'MO ',
              region: '',
              countryId: 'MO ',
            },
            id: 10759074,
            name1: '1065-The Westin Resort Macua',
          },
          currentWebGroupId: 861654347,
          soldtoList: {
            defaultSoldto: {
              isLinked: false,
              soldtoName: '1065-The Westin Resort Macua',
              isActiveUserlinked: 0,
              storeNumber: null,
              isDefault: true,
              address: {
                poBoxZipCode: '',
                zipCode: '00000',
                poBox: '',
                address3: '',
                address2: '',
                city: 'Coloane',
                address1: '1918 Estrada de Hac Sa',
                county: '',
                zipExt: '',
                state: 'MO ',
                region: '',
                countryId: 'MO ',
              },
              phoneNumber: null,
              sapSoldtoStatus: 3,
              currency: 'USD  ',
              soldtoNumber: 10845917,
              isFavorite: false,
            },
            totalRecords: 25,
            soldToList: [
              {
                isLinked: false,
                soldtoName: '100-HOTEL PULITZER',
                isActiveUserlinked: 0,
                storeNumber: null,
                isDefault: true,
                address: {
                  poBoxZipCode: '',
                  zipCode: '1016GZ',
                  poBox: '',
                  address3: '',
                  address2: '',
                  city: 'AMSTERDAM',
                  address1: 'PRINSENGRACHT 315-331',
                  county: '',
                  zipExt: '',
                  state: '08 ',
                  region: '',
                  countryId: 'NL ',
                },
                phoneNumber: null,
                sapSoldtoStatus: 3,
                currency: 'USD  ',
                soldtoNumber: 10759074,
                isFavorite: false,
              },
              {
                isLinked: false,
                soldtoName: '1007-THE WESTIN SAN FRANCISCO AIRPO',
                isActiveUserlinked: 0,
                storeNumber: null,
                isDefault: false,
                address: {
                  poBoxZipCode: '',
                  zipCode: '85267-4029',
                  poBox: '',
                  address3: '',
                  address2: '',
                  city: 'SCOTTSDALE',
                  address1: 'PO BOX 14029',
                  county: '',
                  zipExt: '',
                  state: 'AZ ',
                  region: '',
                  countryId: 'US ',
                },
                phoneNumber: null,
                sapSoldtoStatus: 3,
                currency: 'USD  ',
                soldtoNumber: 10668115,
                isFavorite: false,
              },
            ],
            totalActiveSoldto: null,
            linkedAvailable: false,
            totalPages: 2,
            currentPage: 1,
          },
          currentWebGroupName: 'uat ces',
          login: 'uatmultisoldtoces',
        })
      )
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { rest, server }
