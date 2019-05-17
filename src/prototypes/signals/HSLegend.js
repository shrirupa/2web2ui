import React from 'react';
import styles from './HSLegend.module.scss';

function HSLegend() {
  return (
    <div className={styles.Legend}>
      {/* <label className={styles.Label}>Meaning:</label> */}
      <div className={styles.b}>
        <div className={styles.Desc}>0-55 Bad</div>
      </div>
      <div className={styles.w}>
        <div className={styles.Desc}>55-80 Warning</div>
      </div>
      <div className={styles.g}>
        <div className={styles.Desc}>80+ Good</div>
      </div>
    </div>
  )
}

export default HSLegend;
