import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWShowHide } from './../iw-showHide/iw-showHide'

export class IWTooltip extends PureComponent {
    constructor(props) {
        super(props)
        this.state = { showTip: false }
    }

    handleClick = () => {
        this.setState({ showTip: !this.state.showTip })
    };

    handleMouseEnter = () => {
        this.setState({ showTip: true })
    };

    handleMouseLeave = () => {
        this.setState({ showTip: false })
    };

    render() {
        return (
            <div
                className="iw-tooltippy"
                onClick={this.handleClick}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}>
                {this.props.children}
                <IWShowHide showIf={this.state.showTip}>
                    <span className={cn('iw-tooltippy__content', this.props.className)}>
                        {this.props.tooltip}
                    </span>
                </IWShowHide>
            </div>
        )
    }
}

IWTooltip.propTypes = {
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    className: PropTypes.string,
}
