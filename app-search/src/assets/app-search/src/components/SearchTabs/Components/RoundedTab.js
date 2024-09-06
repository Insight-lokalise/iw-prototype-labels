import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default function RoundedTab({
  children,
  className,
  disabled,
  isSelected,
  onClick,
  ...rest
}) {
  const classes = cn('c-searchTab', className, {
    'is-selected': isSelected
  });

  return (
    <div
      role="button"
      aria-selected={!!isSelected}
      tabIndex={0}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className='c-tabName'>{children}</span>
    </div>
  );
}

RoundedTab.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

RoundedTab.defaultProps = {
  children: null,
  className: '',
  disabled: false,
  isSelected: false
};
