import { createContext } from 'react'

const IAHeaderContext = createContext({
  headerInfo: {
    customContactNumber: '',
    isLoggedIn: false,
    isSEWPUser: false,
    locale: '',
    userInformation: {
      account: {
        id: '',
        name: '',
      },
      availableSites: [
        {
          id: 1234,
          name: '',
        },
      ],
      b2bInfo: {
        customMastheadFooter: false,
        debrandSite: false,
        eProcurementType: '',
        extrinsic: '',
        isB2B: false,
        token: '',
      },
      contract: {
        id: '',
        name: '',
      },
      email: '',
      favoriteLinks: [],
      firstName: '',
      isCreateAccountEnabled: false,
      isInternalUser: false,
      isLiveChatEnabled: false,
      isPhoneNumberEnabled: false,
      lastName: '',
      permissions: {
        enableCountrySelect: false,
        enableFavorites: false,
        enableLogout: false,
        enableNotifications: false,
        enableOrderHistory: false,
        enableSearch: false,
        enableSearchSuggestions: false,
      },
      username: '',
      webGroup: {
        countryCode: '',
        id: '',
        name: '',
      },
      webLoginProfileId: 1234,
    },
  },
})

export default IAHeaderContext
