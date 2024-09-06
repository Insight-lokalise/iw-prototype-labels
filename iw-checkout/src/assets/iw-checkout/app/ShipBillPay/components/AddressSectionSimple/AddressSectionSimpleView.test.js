import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../../__tests__/test-utils'
import AddressSectionSimpleView from './AddressSectionSimpleView'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const countries = [
  {
    "key": "US",
    "value": "USA"
  },
  {
    "key": "CA",
    "value": "Canada"
  }
];
const states = [
  {
    "key": "AE",
    "value": "APO"
  },
  {
    "key": "CA",
    "value": "California"
  },
  {
    "key": "MA",
    "value": "Massachusetts"
  },
  {
    "key": "TX",
    "value": "Texas"
  },
]

jest.mock('../../../../libs/models/Address/address', () => ({
  fetchStatesByCountryCode: jest.fn(() => new Promise((resolve) => resolve(states))),
  fetchCountries: jest.fn(() => new Promise((resolve) => resolve(countries)))
}))

jest.mock('../../../../libs/routes/ScrollIntoView', () => jest.fn())



const selectedAddress = {
  address: {
    address1: "1500 W HEBRON PKWY STE 110",
    address2: "",
    address3: "",
    city: "CARROLLTON",
    countryId: "US",
    county: "X",
    poBox:"",
    poBoxZipCode: "",
    state: "TX",
    zipCode: "75010-6531",
    zipExt: ""
  },
  attentionLine: "Bruce Test Name",
  companyName: "Bruce Test Company",
  favoriteName: "",
  id: 21968100,
  notes: "",
  overrideAddress: false,
  phone: "1111111111",

}

const setup = async ({isReadOnly}) => {

  const fetchPopulateUIFlags = () => ({"fileUpload":false,"redirectURL":"/editLineLevelInfo","taxOverride":false,"limitedUser":false,"requisition":false,"invoiceNotes":false,"singleSoldTo":true,"privateShipTo":false,"singleWebGroup":true,"labConfigNotes":false,"countryOfUsage":false,"warrantyContact":false,"sharedUserFields":false,"diversityPartner":false,"sellRequirements":false,"taxExemptionNumber":"60016213","additionalOrderNotes":false,"cartHasShippableItem":true,"quickCheckoutEligible":true,"lineLevelSmartTrackers":false,"taxExemptChkBoxSelected":true,"contractReportingFields":false,"headerLevelSmartTrackers":true})
  const wrapper = render(    
    <AddressSectionSimpleView
      selectedAddress={selectedAddress}
      defaultAddress={selectedAddress}
      createAddress={() => {}}
      history={{}}
      isCollapsed={false}
      isLimitedUser={false}
      isReadOnly={isReadOnly}
      saveAddress={() => {}}
      selectAddress={() => {}}
      setActiveIndex={() => {}}
      isShipping
      fetchPopulateUIFlags={fetchPopulateUIFlags}
    />)

  return {
    ...wrapper
  }
}

describe('AddressSectionSimpleView tests', () => {
  test('Render edit mode', async () => {
    const { queryByText, getByTestId } = await setup({isReadOnly: false});    
    await waitFor(() => {
      expect(queryByText('Stored addresses')).toBeInTheDocument()
      expect(queryByText('Add new')).toBeInTheDocument()
      expect(getByTestId('attentionLine-input')).toBeInTheDocument()
      expect(queryByText('Bruce Test Company')).toBeInTheDocument()
      expect(getByTestId('phone-input')).toBeInTheDocument()
      expect(getByTestId("continue-button")).toBeInTheDocument()
      expect(queryByText("Default")).toBeInTheDocument()
      expect(queryByText(/Bruce Test Name/i)).not.toBeInTheDocument()
    });
  })
  test('Click Add new link', async () => {
    const { queryByText } = await setup({isReadOnly: false});
    fireEvent.click(queryByText('Add new'))    
    await waitFor(() => {
      expect(queryByText('Add new address')).toBeInTheDocument()
      expect(queryByText('Create new')).toBeInTheDocument()
    });
  })
  test('Click Stored addresses link', async () => {
    const { queryByText } = await setup({isReadOnly: false});
    await waitFor(() => {
      fireEvent.click(queryByText('Stored addresses'))
    });
    expect(queryByText('Current shipping address')).toBeInTheDocument()
    expect(queryByText('Search addresses')).toBeInTheDocument()
    expect(queryByText('Update')).toBeInTheDocument()
  })
  test('Render readonly mode', async () => {
    const { getByText, queryByTestId } = await setup({isReadOnly: true});    
    await waitFor(() => {
      expect(queryByTestId('attentionLine-input')).not.toBeInTheDocument()
      expect(queryByTestId('phone-input')).not.toBeInTheDocument()
      expect(queryByTestId("continue-button")).not.toBeInTheDocument()
      expect(queryByTestId("Default")).not.toBeInTheDocument()
      expect(getByText(/Bruce Test Name/i)).toBeInTheDocument()
      expect(getByText(/Bruce Test Company/i)).toBeInTheDocument()
      expect(getByText(/1500 W HEBRON PKWY STE 110/i)).toBeInTheDocument()
      expect(getByText(/CARROLLTON, TX 75010-6531/i)).toBeInTheDocument()
    });
  })
})
