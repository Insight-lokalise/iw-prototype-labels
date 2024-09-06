import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import cn from 'classnames'
import { Media } from "@insight/toolkit-react";

// import Media from '../Media/Media';
// import PartNumbers from '../PartNumbers/PartNumbers';
import PartNumbers from './PartNumbers';

export default function Product({
  alt,
  children,
  className,
  imageClassName,
  bodyClassName,
  image,
  link,
  openPDP,
  title,
  insightPart,
  mfrPart
}) {
  return (
    <Media className={cn("c-product", className)} image={image} alt={alt} imageClassName="c-cart__product-image" bodyClassName="c-product__body">
      <h3 className="c-product__title u-text-bold">
        {
          (
            openPDP && <a className='c-cart__product-link' onClick={openPDP}>{title}</a>
          ) || (
            link && <a className='c-cart__product-link' href={link}>{title}</a>
          ) || (
            <Fragment>{title}</Fragment>
          )
        }
      </h3>
      <PartNumbers insightPart={insightPart} mfrPart={mfrPart} />
      {children}
    </Media>
  )
}

Product.propTypes = {
  alt: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  image: PropTypes.string.isRequired,
  insightPart: PropTypes.string.isRequired,
  mfrPart: PropTypes.string.isRequired,
  openPDP: PropTypes.func,
  link: PropTypes.string,
  title: PropTypes.string.isRequired,
};

Product.defaultProps = {
  alt: '',
  children: null,
  className: '',
  imageClassName: '',
  bodyClassName: '',
  image: null,
  insightPart: '',
  mfrPart: '',
  openPDP: undefined,
  link: '',
  title: '',
};
