import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { IWSelectField } from '../../../../libs/iw-components/IWForm'
import { t } from '@insight/toolkit-utils/lib/labels'

export default class AccountByRegionView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      opsCenterSelectedText: 'All',
      opsCenterOption: [],
      regionSelectedText: 'All',
      regionOption: [],
    }
    this.displaySelectedRegion = this.displaySelectedRegion.bind(this)
    this.displaySelectedText = this.displaySelectedText.bind(this)
  }

  /**
   *    On mount of this component (dynamic dropdown), build the options for 2 dropdowns
   * */
  componentDidMount() {
    const { opsCentersList } = this.props
    const defaultValue = 'ALL*ALL'
    const opsCenters = [{ value: defaultValue, displayName: t('All') }].concat([...opsCentersList])
    const region = [{ value: defaultValue, displayName: t('All') }]
    this.setState({
      opsCenterOption: opsCenters,
      regionOption: region,
    })
  }

  /*
   * When operation centers are changed, related regions
   * should display in regions dropdown.
   */
  displaySelectedRegion(e) {
    const { regionList } = this.props
    const regions = getOptionValues(e.target.value, regionList)
    const regionsAllValue = getRegionAllValue(regions)
    const dropDownOptions = buildOptions(regions, regionsAllValue)

    this.setState({
      regionOption: dropDownOptions,
      opsCenterSelectedText: e.target.options[e.target.selectedIndex].text,
    })
  }

  displaySelectedText(e) {
    this.setState({
      regionSelectedText: e.target.options[e.target.selectedIndex].text,
    })
  }

  render() {
    const opsCenterLabel = `${t('Selected operations center(s)')} ${this.state.opsCenterSelectedText}`
    const regionLabel = `${t('Selected region(s)')} ${this.state.regionSelectedText}`
    return (
      <div className="row small-12 medium-6 large-12">
        <div className="columns small-12 medium-6 large-4">
          <IWSelectField
            name="opsCenter"
            label={opsCenterLabel}
            multiple
            size="5"
            optionsArrayOrFunction={this.state.opsCenterOption}
            onChange={this.displaySelectedRegion}
          />
        </div>
        <div className="columns small-12 medium-6 large-4">
          <IWSelectField
            name="region"
            multiple
            size="5"
            label={regionLabel}
            optionsArrayOrFunction={this.state.regionOption}
            onChange={this.displaySelectedText}
          />
        </div>
        <div className="columns small-12 medium-6 large-4" />
      </div>
    )
  }
}

function buildOptions(regions, regionsAllValue) {
  const defaultValue = 'ALL*ALL'
  const region = regions
    ? [{ value: regionsAllValue || defaultValue, displayName: t('All') }].concat(
        regions.map(option => ({ value: option.region, displayName: option.regionDescription }))
      )
    : [{ value: defaultValue, displayName: t('All') }]
  return region
}

function getRegionAllValue(regions) {
  return regions && (regions.length > 1 ? regions.map(option => option.region).join(',') : 'ALL*ALL')
}

function getOptionValues(selectedValue, list) {
  const regionsList = list.filter(option => option.some(item => item.regionCountry === selectedValue))
  return regionsList[0]
}

AccountByRegionView.propTypes = {
  opsCentersList: PropTypes.arrayOf(PropTypes.object).isRequired,
  regionList: PropTypes.arrayOf(PropTypes.object).isRequired,
}
