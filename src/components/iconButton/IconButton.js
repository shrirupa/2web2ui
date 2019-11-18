import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ScreenReaderOnly } from '@sparkpost/matchbox';
import styles from './IconButton.module.scss';

const IconButton = (props) => {
  const {
    className,
    onClick,
    screenReaderLabel,
    title,
    children,
    disabled,
    'data-id': dataId
  } = props;

  return (
    <button
      className={classNames(styles.IconButton, className)}
      onClick={onClick}
      title={title}
      disabled={disabled}
      data-id={dataId}
    >
      {children}

      <ScreenReaderOnly>{screenReaderLabel}</ScreenReaderOnly>
    </button>
  );
};

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  screenReaderLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  'data-id': PropTypes.string
};

export default IconButton;
