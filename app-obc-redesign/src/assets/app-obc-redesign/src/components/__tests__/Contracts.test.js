import React from "react"
import TestRenderer from 'react-test-renderer'
import Contracts from "../Contracts"

it('renders the <Contracts /> component', () => {
  const contracts = [
        "SW-0040039434",
        "SW-0040039453",
        "SW-0040040496",
        "SW-0040062808",
        "SW-0040069482",
        "SW-0040086321"
      ]

  const testElement = TestRenderer.create(
    <Contracts
      contracts={contracts}
      consortiaContracts={[]}
      soldTo={null}
      consortiaAgreement={null}
    />,
  )
  const elementSnapshot = testElement.toJSON()
  // const testInstance = testElement.root


  expect(elementSnapshot).toMatchSnapshot()
  })