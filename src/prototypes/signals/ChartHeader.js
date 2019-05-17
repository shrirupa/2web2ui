import React from 'react';
import styles from './ChartHeader.module.scss';


function ChartHeader(props) {
  const { label, value } = props;

  return (
    <div className={styles.ChartHeader}>
      <h6 className={styles.Label}>{label}</h6>
      <div className={styles.Value}>{value}</div>
    </div>
  )
}

export default ChartHeader;
