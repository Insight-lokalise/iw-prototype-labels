import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton } from './../../iw-components';
import { postMessage } from './listener'

export default class IWExpandCollapseAll extends Component {
    constructor() {
        super()
        this.state = {
            isExpandAll: true,
        }
    }

    onToggle = () => {
        const { messageType } = this.props
        const { isExpandAll } = this.state
        postMessage(messageType, isExpandAll)
        this.setState({ isExpandAll: !isExpandAll })
    };

    render() {
        const { isExpandAll } = this.state
        const { className, iconName } = this.props
        const label = isExpandAll ? t('Expand all') : t('Collapse all')
        return (
            <span className={className}>
                <IWButton className="iw-button--link" onClick={this.onToggle}>
                    <span>
                        <span className={iconName} />
                        &nbsp;{label}
                    </span>
                </IWButton>
            </span>
        )
    }
}

IWExpandCollapseAll.propTypes = {
    className: PropTypes.string,
    defaultOpen: PropTypes.bool,
    iconName: PropTypes.string,
    messageType: PropTypes.string.isRequired,
}

IWExpandCollapseAll.defaultProps = {
    iconName: 'ion-arrow-swap',
    label: 'Expand All / Collapse All',
}
