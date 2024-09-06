import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormSection } from 'redux-form'
import { t } from '@insight/toolkit-utils/lib/labels'

import { clearFormSection, copyFormSectionToAll } from '../../actions/lineLevelFormActions'
import { IWAnchor } from '../../../../../libs/iw-components'

class LineLevelSection extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.showCopyToAll !== nextProps.showCopyToAll
    }

    handleClearFormSection = () => {
        const payload = {
            parentFormName: this.props.parentFormName,
            sectionName: this.props.sectionName,
        }
        return this.props.clearFormSection(payload)
    };

    handleCopyFormSectionToAll = () => {
        const payload = {
            parentFormName: this.props.parentFormName,
            sectionName: this.props.sectionName,
        }
        return this.props.copyFormSectionToAll(payload)
    };

    render() {
        return (
            <div className="line-level__section">
                <div className="row expanded">
                    <div className="columns">
                        <h5 className="line-level__subheading">
                            {t(this.props.sectionDisplayName)}
                        </h5>
                    </div>
                    <div className="columns text-right">
                        <IWAnchor onClick={this.handleClearFormSection}>
                            {t('Clear')}
                        </IWAnchor>
                        {this.props.showCopyToAll && <span className="vertical-separator"> | </span>}
                        {this.props.showCopyToAll &&
                            <IWAnchor onClick={this.handleCopyFormSectionToAll}>
                                {t('Copy to all')}
                            </IWAnchor>}
                    </div>
                </div>
                <FormSection name={this.props.sectionName} className="row expanded">
                    {this.props.children}
                </FormSection>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            clearFormSection,
            copyFormSectionToAll,
        },
        dispatch
    )
}

export default connect(null, mapDispatchToProps)(LineLevelSection)

LineLevelSection.propTypes = {
    parentFormName: PropTypes.string.isRequired,
    sectionDisplayName: PropTypes.string.isRequired,
    sectionName: PropTypes.string.isRequired,
    showCopyToAll: PropTypes.bool.isRequired,
}
