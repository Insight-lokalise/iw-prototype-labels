import React from 'react'
import { render } from '@testing-library/react'
import EndIESupportMessage from './EndIESupportMessage'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async ({locale, region, isCheckout}) => {

  const wrapper = render(
    <EndIESupportMessage
      isCheckout={isCheckout}
      testLocale={locale}
      testRegion={region}
    />)

  return {
    ...wrapper,
  }
}

describe('EndIESupportMessage tests', () => {
  test('Message test ', async () => {
    const { queryByText } = await setup({locale: 'en_US', region: 'NA', isCheckout: false})
    expect(queryByText(/Insight will be ending support for Internet Explorer 11 on Nov. 30, 2022. We recommend you open this website in a/i)).toBeInTheDocument()
    expect(queryByText(/supported browser/i)).toBeInTheDocument()
  })
  test('US test', async () => {
    const { queryByText } = await setup({locale: 'en_US', region: 'NA', isCheckout: false})
    expect(queryByText(/supported browser/i).href.indexOf('/en_US/content-and-resources/knowledge-base/myinsight-faqs/e-commerce-guides/what-browsers-does-insight-support.html') > -1).toEqual(true)
  })
  test('CA test', async () => {
    const { queryByText } = await setup({locale: 'en_CA', region: 'NA', isCheckout: false})
    expect(queryByText(/supported browser/i).href.indexOf('/en_CA/help/faqs.html#supported-browsers') > -1).toEqual(true)
  })
  test('APAC test', async () => {
    const { queryByText } = await setup({locale: 'zh_CN', region: 'APAC', isCheckout: false})
    expect(queryByText(/supported browser/i).href.indexOf('/zh_CN/help/frequently-asked-questions.html#supported-browsers') > -1).toEqual(true)
  })
  test('EMEA test', async () => {
    const { queryByText } = await setup({locale: 'de_DE', region: 'EMEA', isCheckout: false})
    expect(queryByText(/supported browser/i).href.indexOf('/de_DE/knowledge-base/help/what-browsers-does-insight-support.html') > -1).toEqual(true)
  })
})