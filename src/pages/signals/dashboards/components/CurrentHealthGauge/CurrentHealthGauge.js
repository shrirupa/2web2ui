import React from 'react';
import { connect } from 'react-redux';
import { getCaretProps } from 'src/helpers/signals';
import { selectCurrentHealthScoreDashboard } from 'src/selectors/signals';
import { Panel, Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import { PanelLoading } from 'src/components';
import Callout from 'src/components/callout';
import { formatDate } from 'src/helpers/date';
import { FORMATS } from 'src/constants';
import Gauge from './Gauge';
import MetricDisplay from '../MetricDisplay/MetricDisplay';
import { HEALTH_SCORE_INFO } from '../../../constants/info';
import thresholds from '../../../constants/healthScoreThresholds';

import _ from 'lodash';

import styles from './CurrentHealthGauge.module.scss';

export function CurrentHealthGauge(props) {
  const noData = _.isNil(props.current_health_score);

  if (props.loading) {
    return <PanelLoading minHeight='407px' />;
  }

  if (props.error) {
    return (
      <Panel sectioned>
        <div className={styles.Content}>
          <div className={styles.ErrorMessage}>
            <Callout title='Unable to Load Data' height='auto' children={_.get(props, 'error.message')} />
          </div>
        </div>
      </Panel>
    );
  }

  let threshold = {};

  for (const key in thresholds) {
    if (thresholds[key].condition(props.current_health_score)) {
      threshold = thresholds[key];
    }
  }

  const DescriptionIcon = threshold.icon;

  function getMetricProps(key) {
    const value = props[key];
    return { value: _.isNil(value) ? 'n/a' : `${value}%`, ...getCaretProps(value) };
  }

  const title = _.get(props, 'filters.relativeRange') === 'custom'
    ? `Health Score for ${formatDate(props.filters.to, FORMATS.DATE)}`
    : 'Current Health Score';

  return (
    <Panel sectioned>
      <div className={styles.Content}>
        <h2 className={styles.Header}>
          {title}
          {' '}
          <Tooltip
            children={<InfoOutline className={styles.TooltipIcon} size={18} />}
            content={HEALTH_SCORE_INFO}
            dark
            horizontalOffset='-1rem'
            right
          />
        </h2>
        {noData && <div><Callout height='auto'>Current Health Score Not Available</Callout></div>}
        {!noData && (
          <>
            <Gauge score={props.current_health_score} threshold={threshold} />
            <div className={styles.Description}>
              <DescriptionIcon className={styles.DescriptionIcon} size={25} style={{ fill: threshold.color }} />
              <p className={styles.DescriptionContent}>{threshold.description}</p>
            </div>
          </>
        )}
        <div className={styles.Metrics}>
          <MetricDisplay label='WoW Change' {...getMetricProps('WoW')} />
          <MetricDisplay label='DoD Change' {...getMetricProps('current_DoD')} />
        </div>
      </div>
    </Panel>
  );
}

const mapStateToProps = (state) => ({
  ...selectCurrentHealthScoreDashboard(state),
  filters: state.signalOptions
});

export default connect(mapStateToProps, {})(CurrentHealthGauge);
