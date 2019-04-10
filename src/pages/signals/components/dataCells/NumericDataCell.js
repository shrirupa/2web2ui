import React from 'react';
import styles from './DataCell.module.scss';

const NumericDataCell = ({ value = null }) => (
  <div className={styles.PaddedCell}>
    {value === null ? '- - -' : value.toLocaleString()}
  </div>
);

export default NumericDataCell;
