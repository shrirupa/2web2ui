import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { list as getSubaccounts } from 'src/actions/subaccounts';
import { getCurrentHealthScore, getInjections } from 'src/actions/signals';
import { Grid } from '@sparkpost/matchbox';
import Page from '../components/SignalsPage';
import HealthScoreOverview from '../containers/HealthScoreOverviewContainer';
import FacetFilter from '../components/filters/FacetFilter';
import DateFilter from '../components/filters/DateFilter';
import SubaccountFilter from '../components/filters/SubaccountFilter';
import CurrentHealthGauge from './components/CurrentHealthGauge/CurrentHealthGauge';
import HealthScoreChart from './components/HealthScoreChart/HealthScoreChart';

export function HealthScoreDashboard(props) {
  const { from, getCurrentHealthScore, getInjections, getSubaccounts, relativeRange, subaccounts, to } = props;

  // Gets subaccount info on mount
  useEffect(() => {
    getSubaccounts();
  }, [getSubaccounts]);

  // Gets injections and current score for gauge and timeseries only when dates change
  useEffect(() => {
    getCurrentHealthScore({ relativeRange, from, to });
    getInjections({ relativeRange, from, to });
  }, [getCurrentHealthScore, getInjections, relativeRange, from, to]);

  return (
    <Page title='Health Score' primaryArea={<DateFilter left />}>
      <Grid>
        <Grid.Column xs={12} lg={5} xl={4}>
          <CurrentHealthGauge />
        </Grid.Column>
        <Grid.Column xs={12} lg={7} xl={8}>
          <HealthScoreChart />
        </Grid.Column>
      </Grid>
      <HealthScoreOverview
        subaccounts={subaccounts}
        hideTitle
        header={
          <Grid>
            <FacetFilter />
            <SubaccountFilter />
          </Grid>
        }
      />
    </Page>
  );
}

const mapStateToProps = (state) => ({
  facet: state.signalOptions.facet,
  from: state.signalOptions.from,
  subaccounts: state.subaccounts.list,
  relativeRange: state.signalOptions.relativeRange,
  to: state.signalOptions.to
});

const mapDispatchToProps = {
  getCurrentHealthScore,
  getSubaccounts,
  getInjections
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthScoreDashboard);
