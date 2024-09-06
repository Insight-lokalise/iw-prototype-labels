import React from 'react'
import { render } from 'test-utils'
import ShopSimple from './ShopSimple'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const menuItems = [
  {
      "targetBlank": false,
      "nodes": [
          {
              "access": {
                  "appearsWhen": "logged-out"
              },
              "link": "/content/insight-web/en_US/shop/category/accessories.html",
              "appearsWhen": "logged-out",
              "title": "Accessories",
              "type": "link",
              "gtmEvent": "shopNav",
              "gtmInfo": "Shop-Products-Accessories",
              "name": "accessories",
              "linkType": "category",
              "href": "/content/insight-web/en_US/shop/category/accessories.html",
              "id": "f502bec53c60066e9b3f8be8d8cb60a8197ceffffca93e414e46d17a96000d28",
              "category": "C-MI",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/category/accessories.html",
                  "category": "C-MI",
                  "type": "category"
              }
          },
          {
              "access": {
                  "userPermission": {
                      "permission": "marketing_includes",
                      "type": "has"
                  },
                  "appearsWhen": "logged-in"
              },
              "link": "/content/insight-web/en_US/shop/category/accessories.html",
              "appearsWhen": "logged-in",
              "title": "Accessories",
              "type": "link",
              "gtmEvent": "shopNav",
              "gtmInfo": "Shop-Products-Accessories",
              "name": "accessories",
              "linkType": "category",
              "href": "/content/insight-web/en_US/shop/category/accessories.html",
              "id": "c238328af535665a4025cd686d9b53e372e854f11540c322801396b6112e0a7a",
              "category": "C-MI",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/category/accessories.html",
                  "category": "C-MI",
                  "type": "category"
              }
          }
      ],
      "access": {
          "appearsWhen": "always"
      },
      "columns": "2",
      "engageFlag": "false",
      "name": "shop-by-product",
      "appearsWhen": "always",
      "id": "91fc289d4379fbe21d6ce8233eb85131526162154eb3fc9af749ed0d8eeae59f",
      "title": "Shop by product",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "access": {
                  "appearsWhen": "always"
              },
              "link": "/content/insight-web/en_US/shop/partner/adobe.html",
              "name": "adobe",
              "linkType": "brand",
              "href": "/content/insight-web/en_US/shop/partner/adobe.html",
              "appearsWhen": "always",
              "id": "9c1ba0dee71fe1e6e3d0c9ce66c432755db0e4e24a06020da09ef4436a4846e0",
              "title": "Adobe",
              "type": "link",
              "brand": "0007000053",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/partner/adobe.html",
                  "type": "brand",
                  "brand": "0007000053"
              }
          },
          {
              "targetBlank": false,
              "backgroundColor": "black",
              "access": {
                  "appearsWhen": "always"
              },
              "engageFlag": "false",
              "link": "/content/insight-web/en_US/shop/partner/apc.html",
              "appearsWhen": "always",
              "title": "APC",
              "type": "link",
              "name": "APC",
              "linkType": "brand",
              "href": "/content/insight-web/en_US/shop/partner/apc.html",
              "id": "684db543d542beba3c0c813baaad6ae0460284d76697e5d17c69d68d5f1936f6",
              "brand": "0007000062",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/partner/apc.html",
                  "type": "brand",
                  "brand": "0007000062"
              }
          }
      ],
      "access": {
          "userPermission": {
              "permission": "shop_by_brand",
              "type": "has"
          },
          "appearsWhen": "always"
      },
      "columns": "2",
      "engageFlag": "false",
      "name": "Shop top brands",
      "appearsWhen": "always",
      "id": "16235b7facf2286b7b3adc8287cfcbe2d597f36961fd8e00650f95662a1ada17",
      "title": "Shop top brands",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "userPermission": {
                      "permission": "inventory_blowout",
                      "type": "disabled"
                  },
                  "appearsWhen": "always"
              },
              "columns": "none",
              "engageFlag": "false",
              "name": "knowledge-base",
              "href": "/content/insight-web/en_US/content-and-resources/knowledge-base.html",
              "appearsWhen": "always",
              "id": "a8c4e75bbd989dc0b8c74b49a6d4c68dfd6126b79abcd9ae3805763473ad352d",
              "title": "Knowledge base",
              "type": "link"
          },
          {
              "targetBlank": false,
              "access": {
                  "userPermission": {
                      "permission": "configurator",
                      "type": "has"
                  },
                  "appearsWhen": "always"
              },
              "name": "product-configurators",
              "href": "/content/insight-web/en_US/shop/category/product-configurators.html",
              "appearsWhen": "always",
              "id": "851e450b166e5c37391120e1d6c509042dace0aea246d3c75b7247fc011eb3f6",
              "title": "Product configurators",
              "type": "link"
          }
      ],
      "access": {
          "userPermission": {
              "permission": "inventory_blowout",
              "type": "disabled"
          },
          "appearsWhen": "always"
      },
      "name": "purchasing-guidance",
      "appearsWhen": "always",
      "id": "e81a8fd718a0bdd2a077da1d0483218b374a684622f9af3ebb10a4c79468bf79",
      "title": "Purchasing guidance",
      "type": "basic"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "name": "technology-deals",
              "href": "/content/insight-web/en_US/shop/category/technology-deals.html",
              "appearsWhen": "always",
              "id": "526c467d480c72a5af706c84623629a728b970ce07bccb93dfa0f9997b68fbf7",
              "title": "Technology deals",
              "type": "link"
          },
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "columns": "none",
              "engageFlag": "false",
              "name": "certified-refurbs",
              "href": "/content/insight-web/en_US/shop/category/technology-deals.html#refurb",
              "appearsWhen": "always",
              "id": "ff0fe5684bfdc0cc4283f277529540f2e1833f1076a1017491be89e00f67efe2",
              "title": "Certified refurbished",
              "type": "link"
          }
      ],
      "access": {
          "userPermission": {
              "permission": "inventory_blowout",
              "type": "has"
          },
          "appearsWhen": "always"
      },
      "name": "explore-our-deals",
      "appearsWhen": "always",
      "id": "030a923966a2ecf90f870b0c1a4b9b626714e31b77efb31172845f6dd471dce0",
      "title": "Explore our deals",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "logged-out"
              },
              "engageFlag": "false",
              "name": "Education",
              "href": "https://www.ips.insight.com/en_US/shop/contracts/education.html",
              "appearsWhen": "logged-out",
              "id": "b34bec2daaa2dd639f78065d9045b039cafde80c28336b2cb9d6a0ef0fdf6eed",
              "title": "Education",
              "type": "link"
          },
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "logged-out"
              },
              "engageFlag": "false",
              "name": "Federal government",
              "href": "https://www.ips.insight.com/en_US/shop/contracts/federal-government.html",
              "appearsWhen": "logged-out",
              "id": "6466aa445586ac6b0e1044b31c2e500a6bda8978e7ed240545a8f89fe5b21453",
              "title": "Federal government",
              "type": "link"
          }
      ],
      "access": {
          "appearsWhen": "logged-out"
      },
      "name": "purchasing-contracts",
      "appearsWhen": "logged-out",
      "id": "e13d68b97939edb1310ba6244d08a3586fdca5e7f42c4b2d5b56dc85ab1b6e5a",
      "title": "Purchasing contracts",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "color": "primary",
              "columns": "none",
              "engageFlag": "false",
              "name": "Log in to your account",
              "href": "/insightweb/login",
              "appearsWhen": "always",
              "id": "74965723968bfca956c7975cfb9a2417646e4e8a07dffdfd73c5ea69ec53e1b8",
              "title": "Log in to your myInsight account",
              "type": "button"
          },
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "color": "inline-link",
              "columns": "none",
              "engageFlag": "false",
              "name": "create-an-account",
              "href": "/insightweb/endUser/createAccount",
              "appearsWhen": "always",
              "id": "f2b83af6ecc3bfa8c925e8591d6c336b266ce2ed9235c378fb7669a3272c3049",
              "title": "Create a myInsight account",
              "type": "button"
          }
      ],
      "access": {
          "appearsWhen": "logged-out"
      },
      "columns": "none",
      "engageFlag": "false",
      "name": "Manage your purchasing and products.",
      "description": "Log in to myInsight for smarter shopping, hardware, software and cloud management, and tailored reporting",
      "appearsWhen": "logged-out",
      "id": "9d1003e586cb0a684a1c9f3a21eac1586e0f924621265b81e999335e35d49bcf",
      "title": "Manage your purchasing and products.",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "color": "inline-link",
              "icon": "desktop",
              "name": "e-commerce",
              "href": "/content/insight-web/en_US/what-we-do/supply-chain-optimization/self-service-e-procurement-tools.html",
              "appearsWhen": "always",
              "id": "74039ea287ac0aa7935dc2b046ece820b2912f1fbe8b1f124f7c23e0df5eaca8",
              "title": "See the benefits of our e-procurement solutions",
              "type": "button"
          },
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "color": "inline-link",
              "icon": "cube",
              "name": "optimization-capabilities",
              "href": "/content/insight-web/en_US/what-we-do/supply-chain-optimization.html",
              "appearsWhen": "always",
              "id": "44bb3454d294582d136b83243e7244425f43fb20c7eb04da2de8919cefd21cfd",
              "title": "See our Supply Chain Optimization capabilities",
              "type": "button"
          }
      ],
      "access": {
          "appearsWhen": "always"
      },
      "columns": "none",
      "engageFlag": "false",
      "name": "Simplify and streamline with an insight.com account.",
      "description": "We’ll help you procure and manage your products throughout their lifecycle.",
      "appearsWhen": "always",
      "id": "ca87dcc32060ccc1b264d3dcf1d143336bc8b09bc33032b3f07b6ba72a89fe3c",
      "title": "Simplify and streamline with a myInsight account.",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "columns": "none",
              "engageFlag": "false",
              "link": "/content/insight-web/en_US/shop/category/cables.html",
              "appearsWhen": "always",
              "title": "Cables",
              "type": "link",
              "gtmEvent": "shopNav",
              "gtmInfo": "Shop-Products-Cables-Overview",
              "name": "cables",
              "linkType": "category",
              "href": "/content/insight-web/en_US/shop/category/cables.html",
              "id": "9975ce5b8bb7d81b9e602dda4545977778af40209a74cc68c8c9a51f87d11d02",
              "category": "C-MH",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/category/cables.html",
                  "category": "C-MH",
                  "type": "category"
              }
          },
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "columns": "none",
              "engageFlag": "false",
              "link": "/content/insight-web/en_US/shop/category/cables.html",
              "appearsWhen": "always",
              "title": "Computer Accessories",
              "type": "link",
              "gtmEvent": "shopNav",
              "gtmInfo": "Shop-Products-Cables-Overview",
              "name": "computer-accessories",
              "linkType": "category",
              "href": "/content/insight-web/en_US/shop/category/cables.html",
              "id": "4608663a70cff8c4c959b6f3cb38fd6271edb93371ef8053e3563bbf85402cf9",
              "category": "C-MH",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/category/cables.html",
                  "category": "C-MH",
                  "type": "category"
              }
          }
      ],
      "access": {
          "appearsWhen": "always"
      },
      "columns": "1",
      "engageFlag": "false",
      "name": "shop-hardware-ces",
      "appearsWhen": "always",
      "id": "aa5fe7ee903f9bf670cf3791868393995c6defb80d61f5920ecf0916e40c8dfb",
      "title": "Shop hardware",
      "type": "none"
  },
  {
      "targetBlank": false,
      "nodes": [
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "columns": "none",
              "engageFlag": "false",
              "link": "/content/insight-web/en_US/shop/category/cables.html",
              "appearsWhen": "always",
              "title": "Business Application",
              "type": "link",
              "gtmEvent": "shopNav",
              "gtmInfo": "Shop-Products-Cables-Overview",
              "name": "business-application",
              "linkType": "category",
              "href": "/content/insight-web/en_US/shop/category/cables.html",
              "id": "7b66f27e3a6f172c3d2d4fa47a56a341595431f3480a2fc65312aeac5f599ace",
              "category": "C-MH",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/category/cables.html",
                  "category": "C-MH",
                  "type": "category"
              }
          },
          {
              "targetBlank": false,
              "access": {
                  "appearsWhen": "always"
              },
              "columns": "none",
              "engageFlag": "false",
              "link": "/content/insight-web/en_US/shop/category/cables.html",
              "appearsWhen": "always",
              "title": "Cloud Delivery",
              "type": "link",
              "gtmEvent": "shopNav",
              "gtmInfo": "Shop-Products-Cables-Overview",
              "name": "cloud-delivery",
              "linkType": "category",
              "href": "/content/insight-web/en_US/shop/category/cables.html",
              "id": "262493fe9561688af4e1fcb9fd5d2573ccd29f0e1a7934d8cd0fefc661c4f1b4",
              "category": "C-MH",
              "productType": {
                  "link": "/content/insight-web/en_US/shop/category/cables.html",
                  "category": "C-MH",
                  "type": "category"
              }
          }
      ],
      "access": {
          "appearsWhen": "always"
      },
      "columns": "1",
      "engageFlag": "false",
      "name": "shop-software-ces",
      "appearsWhen": "always",
      "id": "81381184f6a9cd8acbbc4cc28b08637b3ddf197daf6570f25f3e62a82052cb2a",
      "title": "Shop software",
      "type": "none"
  },
  {
    "targetBlank": false,
    "nodes": [
        {
            "targetBlank": false,
            "access": {
                "appearsWhen": "always"
            },
            "color": "inline-link",
            "columns": "none",
            "engageFlag": "false",
            "name": "technology-deals",
            "href": "/content/insight-web/en_US/shop/category/technology-deals.html",
            "appearsWhen": "always",
            "id": "2c006a7cd1be1785a11bc24210f14a7685d36523b0a609bb607598962c55ba9e",
            "title": "Technology deals",
            "type": "button"
        },
        {
            "targetBlank": false,
            "access": {
                "appearsWhen": "always"
            },
            "color": "inline-link",
            "columns": "none",
            "engageFlag": "false",
            "name": "certified-refurbs",
            "href": "/content/insight-web/en_US/shop/category/technology-deals.html#refurb",
            "appearsWhen": "always",
            "id": "6d1464b43814da36ba5688719b80e41063110e33d53786849fd9c24f1039baf8",
            "title": "Certified refurbished",
            "type": "button"
        }
    ],
    "access": {
        "userPermission": {
            "permission": "inventory_blowout",
            "type": "has"
        },
        "appearsWhen": "always"
    },
    "name": "explore-our-deals-ces",
    "appearsWhen": "always",
    "id": "b34c857b810ae9a73fcad8c674918e98a5a6fd9edf9a8f115ece3444674e7dfc",
    "title": "Explore our deals",
    "type": "none"
  },
  {
    "targetBlank": false,
    "nodes": [
        {
            "targetBlank": false,
            "access": {
                "userPermission": {
                    "permission": "configurator",
                    "type": "has"
                },
                "appearsWhen": "always"
            },
            "color": "inline-link",
            "columns": "none",
            "engageFlag": "false",
            "name": "product-configurators",
            "href": "/content/insight-web/en_US/shop/category/product-configurators.html",
            "appearsWhen": "always",
            "id": "d5edbfc14cc93a2dc7acfd5818a51c0f2866f43f219f178c1e7af486f8d58c8c",
            "title": "Product configurators",
            "type": "button"
        }
    ],
    "access": {
        "appearsWhen": "always"
    },
    "columns": "1",
    "engageFlag": "false",
    "name": "purchasing-guidance-ces",
    "appearsWhen": "always",
    "id": "d421fc3bf2891d7281e0fe9ce92af69e6c585d0992b717d3ac52c9be6359b197",
    "title": "Purchasing guidance",
    "type": "basic"
  }
]

const setup = async () => {

  const onSelect = jest.fn()

  const wrapper = render(
    <ShopSimple
      isMobile={false}
      submenuList={menuItems}
    />)

  return {
    ...wrapper,
    onSelect,
  }
}

describe('ShopSimple tests', () => {
  test('Render ShopSimple', async () => {
    const { getAllByText } = await setup();
    expect(getAllByText('Shop hardware').length > 0).toEqual(true)
    expect(getAllByText('Shop software').length > 0).toEqual(true)
    expect(getAllByText('Shop top brands').length > 0).toEqual(true)
    expect(getAllByText('Explore our deals').length > 0).toEqual(true)
    expect(getAllByText('Purchasing guidance').length > 0).toEqual(true)
  })
})

const loggedOutMenuSetup = async () => {

    const onSelect = jest.fn()
  
    const wrapper = render(
      <ShopSimple
        isMobile={false}
        submenuList={menuItems}
        showLoggedOutMenu={true}
      />)
  
    return {
      ...wrapper,
      onSelect,
    }
  }
  
  describe('ShopSimple tests', () => {
    test('Render ShopSimple', async () => {
      const { getAllByText } = await loggedOutMenuSetup();
      expect(getAllByText('Shop hardware').length > 0).toEqual(true)
      expect(getAllByText('Shop software').length > 0).toEqual(true)
      expect(getAllByText('Shop top brands').length > 0).toEqual(true)
      expect(getAllByText('Explore our deals').length > 0).toEqual(true)
      expect(getAllByText('Purchasing guidance').length > 0).toEqual(true)
      expect(getAllByText('Purchasing contracts').length > 0).toEqual(true)
    })
  })
