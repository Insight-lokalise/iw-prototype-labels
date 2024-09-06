import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Date, Icon, Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import Details from '../containers/Details'
import { dayDifference } from '../lib'

export default class Section extends Component {
  constructor() {
    super()
    this.generateRow = this.generateRow.bind(this)
    this.openRow = this.openRow.bind(this)
    this.state = {
      open: false
    }
  }

  generateRow(cart) {
    const { createdDate, id, name } = cart
    const { open } = this.state
    const { addCart, addLoading, deleteCart, type } = this.props
    const days = dayDifference(createdDate)
    const classes = cn("o-grid  o-grid--center  c-saved-cart__row", { 'is-open': id === open })
    const isLoading = addLoading === id
    return (
      <div className={classes} key={id}>
        <div className="o-grid__item  u-1/2  u-1/3@tablet  u-1/2@desktop  c-saved-cart__cell  c-saved-cart__cell--name">
          <Button onClick={() => this.openRow(id)} color="inline-link" className="c-saved-cart__btn">
            <Icon icon={id === open ? 'arrow-up' : 'arrow-down'} className="c-saved-cart__icon" />
          </Button>
          <h3 className="c-saved-cart__heading">{name}</h3>
        </div>
        <div className="o-grid__item  u-1/2  u-1/3@tablet  u-1/4@desktop  c-saved-cart__cell  c-saved-cart__cell--date  u-text-center">
          <span className="c-saved-cart__date"><Date date={createdDate} />&nbsp;</span>
          <span className="c-saved-cart__date">{`${days}`}</span>
        </div>
        <div className="o-grid__item  u-1/1  u-1/3@tablet  u-1/4@desktop  c-button-group  c-button-group--center  c-saved-cart__cell  c-saved-cart__cell--actions">
          <Button color="link" onClick={() => deleteCart(name, id, type)} size="small">{t('Delete')}</Button>
          <Button
            color="primary"
            isLoading={isLoading}
            size="small"
            onClick={() => addCart(name, id)}
            className="u-no-wrap"
          >
            {t('Add to cart') }
          </Button>
        </div>
        { id === open && (
          <div className="o-grid__item  u-1/1  c-saved-cart__cell  c-saved-cart__cell--cart">
            <Details id={id} type={type} />
          </div>
        )}
      </div>
    )
  }

  openRow(id) {
    const { open } = this.state
    const { retrieveCart } = this.props
    retrieveCart(id)
    this.setState({ open: open !== id ? id : false })
  }

  render() {
    const { className, data, type } = this.props
    const title = type === 'carts' ? 'Saved carts' : 'Order templates'
    return (
      <Panel className={cn('c-saved-cart', className)}>
        <Panel.Title><h2 className="c-saved-cart__title">{t(title)}</h2></Panel.Title>
        <div className="o-grid  o-grid--center  c-saved-cart__header">
          <div className="o-grid__item  u-1/2  u-1/3@tablet  u-1/2@desktop  c-saved-cart__cell  c-saved-cart__cell--header">{t('Cart name')}</div>
          <div className="o-grid__item  u-1/2  u-1/3@tablet  u-1/4@desktop  c-saved-cart__cell  c-saved-cart__cell--header  u-text-center">{t('Creation date')}</div>
          <div className="o-grid__item  u-1/2  u-1/3@tablet  u-1/4@desktop  c-saved-cart__cell  c-saved-cart__cell--header  u-text-center  u-show@tablet">{t('Actions')}</div>
        </div>
        {data.map(this.generateRow)}
      </Panel>
    )
  }
}

Section.propTypes = {
  addCart: PropTypes.func.isRequired,
  addLoading: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    createdDate: PropTypes.number.isRequired,
    id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  deleteCart: PropTypes.func.isRequired,
  retrieveCart: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['carts', 'orders']).isRequired
}
Section.defaultProps = {
  addLoading: undefined,
  className: '',
}
