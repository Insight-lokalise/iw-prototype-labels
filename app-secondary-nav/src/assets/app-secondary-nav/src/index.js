import React from 'react'
import { render } from 'react-dom'

import {fetchSecondaryNavData} from 'api'

import SecondaryNavigation from './components/SecondaryNavigation'
import './scss/index.scss'

const element = document.getElementById('react-app-secondary-nav')
const aemComponentPath = element.dataset.componentPath

fetchSecondaryNavData(aemComponentPath)
  .then(({data}) => {
    render(<SecondaryNavigation navInfo={data} />, element)
  })



