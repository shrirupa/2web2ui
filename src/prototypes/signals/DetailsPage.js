import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Popover, ActionList } from '@sparkpost/matchbox';
import Page from 'src/pages/signals/components/SignalsPage';
import DateFilter from 'src/pages/signals/components/filters/DateFilter';
import BarChart from 'src/pages/signals/components/charts/barchart/BarChart';
import withDateSelection from 'src/pages/signals/containers/withDateSelection';
import { HEALTH_SCORE_COMPONENT_INFO, HEALTH_SCORE_COMPONENTS } from 'src/pages/signals/constants/info';
import { formatNumber, roundToPlaces } from 'src/helpers/units';
import useComponentSelect from './useComponentSelect';
import { ComponentSelect } from './Select';
import ChartHeader from './ChartHeader';
import HSLegend from './HSLegend';
import HSMetric from './HSMetric';
import { Recommendations, SectionTitle } from './Rec';

// import styles from './DetailsPage.module.scss';

import moment from 'moment';
import _ from 'lodash';

import { healthData, spamData } from './data';

function DetailsPage(props) {
  const [components, add, remove] = useComponentSelect(props.data);

  function formatShortDate(d) {
    return moment(d).format('M.D')
  }

  function formatPer(n) {
    return `${roundToPlaces(n * 100, 3)}%`
  }

  function getXTicks() {
    return [
      _.get(_.first(props.data), 'date'),
      props.hoveredDate,
      props.selectedDate,
      _.get(_.last(props.data), 'date'),
    ]
  }

  return (
    <Page
      // title='Health Score'
      dimensionPrefix='Health Score'
      facet='sending_domain'
      facetId='example.com'
      primaryAction={{ content: 'Create Alert' }}
      breadcrumbAction={{ content: 'Back to Health Score Dashboard' }}
      >
      <Panel>
        <Panel.Section>
          <ComponentSelect add={add} components={components} remove={remove} />
        </Panel.Section>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={8}>
              <HSMetric
                date={props.hoveredDate || props.selectedDate}
                injections={_.get(_.find(props.data, ['date', props.hoveredDate || props.selectedDate]), 'injections')}
                score={_.get(_.find(props.data, ['date', props.hoveredDate || props.selectedDate]), 'hs')}
              />
              {/* <div style={{ display: 'flex', 'alignItems': 'flex-end', height: '100%' }}>
                <ChartHeader
                  label={'Health Score'}
                  value={_.get(_.find(props.data, ['date', props.hoveredDate || props.selectedDate]), 'hs')}
                />
                <ChartHeader
                  label={'Injections'}
                  value={formatNumber(_.get(_.find(props.data, ['date', props.hoveredDate || props.selectedDate]), 'injections'))}
                />
              </div> */}
            </Grid.Column>
            <Grid.Column xs={4}>
              <DateFilter left />
              <HSLegend />
            </Grid.Column>
          </Grid>
          <BarChart
            cartesianGridProps={{
              horizontal: false
            }}
            onMouseOver={props.handleDateHover}
            onMouseOut={props.resetDateHover}
            onClick={props.handleDateSelect}
            selected={props.selectedDate}
            hovered={props.hoveredDate}
            timeSeries={props.data}
            disableHover
            activeFill='#0B58B0'
            gap={0.2}
            yKey='hs'
            height={!!components.length ? 190 : 220}
            xAxisProps={{
              hide: !!components.length,
              ticks: getXTicks(),
              tickFormatter: formatShortDate,
              interval: 0
            }}
            yAxisProps={{ ticks: [0,55,80,100], tickLine: true, }}
          />
          {
            _.map(components, (component, i) => {
              const last = i !== components.length - 1;
              const value = roundToPlaces(_.get(_.find(component.data, ['date', props.hoveredDate || props.selectedDate]), 'value') * 100, 4);
              return (
                <div>
                  <ChartHeader
                    label={HEALTH_SCORE_COMPONENTS[component.key].label}
                    value={!_.isNil(value) ? `${value}%` : ''}
                  />
                  <BarChart
                    disableHover
                    onMouseOver={props.handleDateHover}
                    hovered={props.hoveredDate}
                    selected={props.selectedDate}
                    onMouseOut={props.resetDateHover}
                    onClick={props.handleDateSelect}
                    cartesianGridProps={{
                      horizontal: false
                    }}
                    fill='#BEBEC3'
                    activeFill='#55555A'
                    height={last ? 50 : 80}
                    yKey={'value'}
                    timeSeries={component.data}
                    xAxisProps={{
                      hide: last,
                      tickFormatter: formatShortDate,
                      ticks: getXTicks(),
                      interval: 0,
                    }}
                    yAxisProps={{
                      tickFormatter: formatPer,
                      tickLine: true,
                      interval: 'preserveStartEnd',
                      minTickGap: 0
                    }}
                    margin={{ top: 12, left: 18, right: 0, bottom: 10 }}
                  />
                </div>
              )
            })
          }
        </Panel.Section>
      </Panel>
      <SectionTitle date={props.selectedDate} />
      <Recommendations weights={_.get(_.find(props.data, ['date', props.selectedDate]), 'weights')} />
    </Page>
  );
}


const Container = withDateSelection(DetailsPage);

function Wrapper(props) {
  const { relativeRange, to, from } = props;
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  function fill(score) {
    if (score < 0.55) {
      return 'D1E4F4';
    }

    if (score < 0.8) {
      return '#91C5FD'
    }

    return '#4194ED'
  }

  // simulate data change to trigger date selection
  useEffect(() => {
    let toSlice;

    const transformed = healthData.history.map(({ dt, health_score, ...rest }) => ({
      date: dt,
      hs: (health_score * 100).toFixed(2),
      injections: _.find(spamData.history, ['dt', dt]).injections,
      fill: fill(health_score),
      ...rest
    }));

    if (relativeRange !== 'custom') {
      toSlice = 90 - relativeRange.replace('days', '');
    } else {
      toSlice = 90 - moment(to).diff(moment(from), 'days');
    }

    setData([...transformed.slice(toSlice, transformed.length)])
  },[relativeRange, to, from]);

  useEffect(() => {
    setFilters({
      from: _.get(_.first(data), 'date'),
      to: _.get(_.last(data), 'date')
    })
  }, [data])

  return <Container {...props} data={data} filters={filters} />
};

export default connect((state) => ({
  relativeRange: state.signalOptions.relativeRange,
  to: state.signalOptions.to,
  from: state.signalOptions.from
}))(Wrapper)
