import React from 'react'
import PropTypes from 'prop-types'
import { Currency } from '@insight/toolkit-react'
import { Button, Icon, Modal } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function ListItemCardModalView({
	closeModal,
	displayDescriptionShort,
	imageURL,
	isValid,
	manufacturerPartNumber,
	materialId,
	modalIsOpen,
	price,
	quantity,
	isEMEA,
}) {
	return (
		<Modal
			isOpen={modalIsOpen}
			onClose={closeModal}
			className="c-item-card__modal c-pdp-modal"
		>
			<div className="c-modal__header c-item-card__modal-header">
				<Button className="c-modal__close" color="subtle" onClick={closeModal}>
					<Icon className="c-modal__icon" icon="close" title="Close" />
				</Button>
			</div>
			<Modal.Body className="o-grid c-item-card__modal-body">
				<div className="o-grid__item u-1/6">
					<img className="c-item-card__modal-image" src={imageURL} alt={displayDescriptionShort} />
				</div>
				<div className="o-grid__item u-1/2 c-item-card__modal-description">
					<h4 className="c-item-card__modal-description__title">{displayDescriptionShort}</h4>
					<div className="c-item-card__modal-description--added">
						<Icon icon="checkmark-circled" type="info" className="c-item-card__modal-description__icon" />
						<p className="c-item-card__modal-description__text">{t('Added to Your Cart')}</p>
					</div>
				</div>
				<div className="o-grid__item u-1/3 c-item-card__modal-info">
					<ul className="c-item-card__modal-info__list">
						<li><span className="c-item-card__modal-info__list-item">{t('Insight #')}:</span>{materialId}</li>
						<li><span className="c-item-card__modal-info__list-item">{t('Mfr #')}:</span>{manufacturerPartNumber}</li>
						<li><span className="c-item-card__modal-info__list-item">{t('Quantity')}:</span>{quantity}</li>
						{isValid && <li><span className="c-item-card__modal-info__list-item">{t('Total')}: <Currency currencyCode={price.currency} value={(price.yourBestPrice * Number(quantity))} showVAT={isEMEA} tax={false} /></span></li>}						
					</ul>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={closeModal} color="secondary" className="c-item-card__modal-button">
					{t('Continue Shopping')}
				</Button>
				<Button href="/insightweb/viewCart" color="primary" className="c-item-card__modal-link">
					{t('Continue to Checkout')}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

ListItemCardModalView.propTypes = {
	closeModal: PropTypes.func.isRequired,
	displayDescriptionShort: PropTypes.string,
	imageURL: PropTypes.string,
	isValid: PropTypes.bool,
	manufacturerPartNumber: PropTypes.string,
	materialId: PropTypes.string.isRequired,
	modalIsOpen: PropTypes.bool.isRequired,
	price: PropTypes.shape({
		currency: PropTypes.string,
		yourBestPrice: PropTypes.string,
		yourBestVatInclusivePrice: PropTypes.number,
	}),
	quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isEMEA: PropTypes.bool.isRequired,
}

ListItemCardModalView.defaultProps = {
	displayDescriptionShort: '',
	imageURL: '',
	isValid: false,
	manufacturerPartNumber: '',
	price: null,
	quantity: ''
}
