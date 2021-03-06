import React from 'react';
import { formatDate } from 'src/helpers/date';
import { formatNumber, roundToPlaces } from 'src/helpers/units';

import styles from './HealthScoreMetric.module.scss';

function HealthScoreMetric({ date, score, injections }) {
  return (
    <div className={styles.HSMetric}>
      <div className={styles.Date}>{formatDate(date)}</div>
      <h3 className={styles.Score}>{roundToPlaces(score, 1)}</h3>
      <h3 className={styles.Injections}>{formatNumber(injections)} Injections</h3>
    </div>
  );
}

export default HealthScoreMetric;
