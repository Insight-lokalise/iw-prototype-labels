import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import { Button, Field, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils';
import { getSelectedAgreementAssortments, windowPrint } from '../../helpers'
import { getSearchResultsURL } from '../../../lib'
import { print, viewAgreements, viewSelectedProducts, options} from '../../../constants'
import AgreementHeader from './AgreementHeader'

export default class TopHeaderView extends Component {
  state = {
  	selectAll: false
  }

  componentDidUpdate(prevProps) {
    if (this.props.updatedParentState !== prevProps.updatedParentState) {
      this.setState({selectAll: this.props.updatedParentState});
    }
  }

  getSelectedAgreementIds = () => {
    const { contractAndAssortments } = this.props
    const agreement = getSelectedAgreementAssortments(contractAndAssortments)
    window.location.href = getSearchResultsURL(agreement.allContractIds, agreement.assortmentIds)
  }

  toggleSelectAll = () => {
    this.setState(({selectAll}) => ({
      selectAll: !selectAll
    }), () => this.props.updateChildSelect(this.state.selectAll))
  }

  render() {
    const { enableSelect, filterBy, filterByOptions, hasActiveContracts, isExpandClicked, isBrowseBySoftwareAgreementsEnabled, toggleExpanded, agreementSize } = this.props
    return (
      <Fragment>
        <div className='o-grid__item u-1/1 u-width-auto@tablet u-2/4@desktop u-hide@print'>
          <div className="o-grid o-grid--gutters">
            {isBrowseBySoftwareAgreementsEnabled &&
              <div className='o-grid__item u-1/1 u-width-shrink@tablet c-software-license__padding-top c-software-license__padding-bot'>
                <Button color="primary" isDisabled={!hasActiveContracts} onClick={this.getSelectedAgreementIds} className="c-button--block">{t(viewSelectedProducts)}</Button>
              </div>
            }
          </div>
        </div>
        <div className='o-grid__item u-1/1 u-hide@print'>
            <div className='o-grid__item u-1/1 c-software-license__padding-top c-software-license__padding-bot'>
              <div className="o-grid o-grid--gutters">
                <div className='o-grid__item  u-1/1 u-2/4@desktop'>
                  <Field
                    className='c-software-license__show-all'
                    name="showAll"
                    fieldComponent="Select"
                    type="select"
                    value={filterBy}
                    options={options.map(option => {
                      return {
                        text: t(option.text),
                        value: option.value
                      }
                    })}
                    handleChange={filterByOptions}
                    label={t(viewAgreements)}
                  />
                 </div>
                 <div className='o-grid__item u-text-right u-1/1 u-2/4@desktop u-show@desktop'>
                  <div className='o-grid o-grid--gutters o-grid--justify-right'>
                    <div className='o-grid__item o-grid__item--shrink u-show@desktop c-software-license__padding-top c-software-license__padding-bot'>
                      <Button color="link" className='c-button--inline-link' onClick={windowPrint}><span className='c-software-license__margin-right'>{t(print)}</span><Icon icon='print' className='c-icon' /></Button>
                    </div>
                  </div>
                 </div>
                </div>
            </div>
        </div>

        <AgreementHeader
          enableSelect={enableSelect}
          isBrowseBySoftwareAgreementsEnabled={isBrowseBySoftwareAgreementsEnabled}
          isExpandClicked={isExpandClicked}
          hasActiveContracts={hasActiveContracts}
          toggleExpanded={toggleExpanded}          
          toggleSelectAll={this.toggleSelectAll}
          selectAllState={this.state.selectAll}
          agreementSize={agreementSize}
        />     
      </Fragment>
    )
  }

}

TopHeaderView.propTypes = {
  contractAndAssortments: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array,PropTypes.bool])),
  enableSelect: PropTypes.bool.isRequired,
  isBrowseBySoftwareAgreementsEnabled: PropTypes.bool.isRequired,
  filterByOptions: PropTypes.func.isRequired,
  filterBy: PropTypes.string.isRequired,
  hasActiveContracts: PropTypes.bool.isRequired,
  isExpandClicked: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
  updateChildSelect: PropTypes.func.isRequired,
  updatedParentState: PropTypes.bool.isRequired,
  agreementSize: PropTypes.number.isRequired,
}

TopHeaderView.defaultProps = {
  contractAndAssortments: {}
}
