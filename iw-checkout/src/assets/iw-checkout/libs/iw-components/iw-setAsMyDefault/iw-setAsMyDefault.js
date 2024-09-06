import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { IWCheckboxField } from '../../iw-components/iw-form'
import { t } from '@insight/toolkit-utils/lib/labels'
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";


export class IWSetAsMyDefault extends Component {
    constructor(props) {
        super()
        this.state = {
            newValue: props.value,
        }
    }

    componentDidMount() {
        this.props.clearSetAsMyDefault(this.props.name)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (prevState.newValue !== nextProps.value) {
            return { newValue : nextProps.value }
        } else {
            return null;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.newValue !== this.props.value){
            this.props.clearSetAsMyDefault(this.props.name)
        }
    }

    render() {
        const trim = (str) => (str || '').trim()
        const {
            defaultValue,
            name,
            onChange,
            readOnly,
            value,
        } = this.props;
        const renderSetDefault = (position) => {
            return ((value === defaultValue) ?
                <div className='row expanded is-collapse-child'>
                  <div className='columns small-12'>
                    <div className='iw-set-as-my-default__label'>
                      <span className={'iw-set-as-my-default__information iw-set-as-my-default__' + position}>{(defaultValue === '') ? '' :
                        <Lozenge color='info'>{t('Default')}</Lozenge>
                      }</span>
                    </div>
                  </div>
                </div>
                    :
                <span className={'columns small-12 iw-set-as-my-default__checkbox iw-set-as-my-default__' + position}>
                    {!readOnly && trim(value) !== '' &&
                    <IWCheckboxField
                        className="form__label--inline"
                        label={t('Set as default')}
                        name={name}
                        onChange={onChange}
                    />
                    }
                </span>
            )
        }

        let fieldTop = ''
        let fieldBottom = ''
        let isShow = 'iw-set-as-my-default__hide'
        if (this.props.show) {
            isShow = 'iw-set-as-my-default__show'
            if (this.props.fieldPosition === 'top') {
                fieldTop = renderSetDefault('top');
            } else if (this.props.fieldPosition === 'bottom') {
                fieldBottom = renderSetDefault('bottom');
            }
        }

        return (
            <div className={cn('iw-set-as-my-default', isShow, this.props.className)}>
                { this.props.label && (
                  this.props.labelClassName === "fieldset__heading" ? <legend><h4 className={cn('iw-set-as-my-default__label', this.props.labelClassName)}>{this.props.label}</h4></legend> : <h4 className={cn('iw-set-as-my-default__label', this.props.labelClassName)}>{this.props.label}</h4>
                )}
                {fieldTop}
                {this.props.children}
                {fieldBottom}
            </div>
        )
    }
}

IWSetAsMyDefault.defaultProps = {
    show: true,
    fieldPosition: 'bottom',
}

IWSetAsMyDefault.propTypes = {
    className: PropTypes.string,
    clearSetAsMyDefault: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
    fieldPosition: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    show: PropTypes.bool,
    value: PropTypes.string,
}
