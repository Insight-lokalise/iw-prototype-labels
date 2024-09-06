import React, { Component } from 'react'
import PropTypes from 'prop-types';
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton } from './../../iw-components';
import { listen } from './listener'

export default class IWExpandCollapse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isExpanded: props.defaultOpen,
        }
    }

    componentDidMount() {
        const { messageType } = this.props
        this.cancelListener = listen(messageType, (isExpanded) => this.setState({ isExpanded }))
    }

    componentWillUnmount() {
        this.cancelListener()
    }

    onToggle = () => {
        const { isExpanded } = this.state
        this.setState({ isExpanded: !isExpanded })
    };

    render() {
        const { children, className, enableExpandCollapse, label } = this.props
        const { isExpanded } = this.state
        return (
            <div>
                {enableExpandCollapse &&
                    <div className={className}>
                        <IWButton className="iw-button--link" onClick={this.onToggle}>
                             <span>
                                <span className={cn({
                                    'ion-chevron-up': isExpanded,
                                    'ion-chevron-down': !isExpanded,
                                })} />
                                 &nbsp;{`${t(label)}`}
                            </span>
                        </IWButton>
                    </div>
                }
                {isExpanded && children}
            </div>
        )
    }
}

IWExpandCollapse.propTypes = {
    className: PropTypes.string,
    defaultOpen: PropTypes.bool,
    enableExpandCollapse: PropTypes.bool,
    messageType: PropTypes.string.isRequired,
    label: PropTypes.string,
}

IWExpandCollapse.defaultProps = {
    enableExpandCollapse: true,
    defaultOpen: false,
    label: 'Expand/Collapse',
}






