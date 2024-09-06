import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { t } from '@insight/toolkit-utils/lib/labels'

import { color_green, color_red } from '../../ada_colors'
import Dashlet from '../Dashlet'
import { fetchELDJumpUrl } from '../../../../services'
import { IWLoading } from '../../../../iw-components'

export default class LicensePositionByPublisher extends Component {
    componentDidMount() {
        if (!(this.props.licensing && this.props.licensing.hasData)) {
            this.props.getData()
        }
    }
    render() {
        const {
            licensing: {
                data,
                hasData,
            },
            toggleThisDashlet,
        } = this.props

        return (
          <Dashlet
            headerLink={{ linkFunction: () => redirect(), text: 'View all' }}
            title={'License Position by Publisher'}
            toggleThisDashlet={toggleThisDashlet}
          >
            {hasData ? (
              <div className="dashlet__chart-wrapper">
                <ResponsiveContainer>
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                    onClick={e => redirect(e.activeLabel)}
                  >
                    <XAxis
                      dataKey='publisher'
                      tick={{ transform: 'translate(0, 5)' }}
                      type='category'
                    />
                    <YAxis
                      tick={{ transform: 'translate(0, -5)'}}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      tickFormatter={tickFormatter}
                      type='number'
                    />
                    <CartesianGrid stroke={'#999'} />
                    <Tooltip
                      cursor={{ fill: '#eeeeee' }}
                      formatter={tickFormatter}
                      labelFormatter={t}
                    />
                    <Legend formatter={compliancy} />
                    <Bar
                      key='compliant'
                      dataKey='compliant'
                      stackId='a'
                      fill={color_green}
                    />
                    <Bar
                      key='noncompliant'
                      dataKey='noncompliant'
                      stackId='a'
                      fill={color_red}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="dashlet__loading-wrapper">
                <IWLoading />
              </div>
            )}
          </Dashlet>
        )
    }
}

LicensePositionByPublisher.propTypes = {
    getData: PropTypes.func.isRequired,
    licensing: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
            compliant: PropTypes.number.isRequired,
            noncompliant: PropTypes.number.isRequired,
            publisher: PropTypes.string.isRequired,
        })),
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    toggleThisDashlet: PropTypes.func,
}

LicensePositionByPublisher.defaultProps = {
  toggleThisDashlet: undefined
}

function tickFormatter(tick) {
    return `${tick}%`
}
function redirect(publisher) {
  fetchELDJumpUrl('licenseposition', publisher).then(response => {
    window.location.assign(response.data)
  })
}
function compliancy(word) {
  return t(word === 'compliant' ? 'Compliant' : 'Non-compliant')
}
