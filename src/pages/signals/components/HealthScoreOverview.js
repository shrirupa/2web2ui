/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import { Panel, Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import SummaryTable, { Column } from 'src/components/summaryTable';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { HEALTH_SCORE_INFO } from '../constants/info';
import { DEFAULT_VIEW } from '../constants/summaryTables';
import FacetDataCell from './dataCells/FacetDataCell';
import NumericDataCell from './dataCells/NumericDataCell';
import SparklineDataCell from './dataCells/SparklineDataCell';
import WoWDataCell from './dataCells/WoWDataCell';
import WoWHeaderCell from './dataCells/WoWHeaderCell';
import styles from './SpamTrapOverview.module.scss';

class HealthScoreOverview extends React.Component {

  componentDidMount() {
    this.resetTable();
  }

  // assumptions, signalOptions and summaryTable should never both change on the same update and
  // resetting signal options will trigger a summary table reset which calls getData
  componentDidUpdate(prevProps) {
    const { signalOptions, summaryTable } = this.props;

    if (prevProps.signalOptions !== signalOptions) {
      this.resetTable();
    }

    if (prevProps.summaryTable !== summaryTable) {
      this.getData();
    }
  }

  resetTable = () => {
    const { facet, resetSummaryTable, tableName } = this.props;
    let options;

    if (facet.key === 'sid') {
      options = DEFAULT_VIEW;
    }

    resetSummaryTable(tableName, options);
  }

  getData = () => {
    const { getHealthScore, signalOptions, summaryTable } = this.props;
    let { subaccount } = signalOptions;
    let order;
    let orderBy;

    if (summaryTable.order) {
      order = summaryTable.order.ascending ? 'asc' : 'desc';
      orderBy = summaryTable.order.dataKey;
    }

    if (subaccount && subaccount.id === undefined) {
      subaccount = undefined; // unset
    }

    getHealthScore({
      facet: signalOptions.facet,
      filter: signalOptions.facetSearchTerm,
      from: signalOptions.from,
      limit: summaryTable.perPage,
      offset: (summaryTable.currentPage - 1) * summaryTable.perPage,
      order,
      orderBy,
      relativeRange: signalOptions.relativeRange,
      subaccount,
      to: signalOptions.to
    });
  }

  handleClick = (facetId, subaccountId) => ({ date }) => {
    const { facet, history } = this.props;
    let search;

    if (facet.key === 'sid' && facetId === -1) {
      return; // ignore
    }

    if (subaccountId >= 0) {
      search = setSubaccountQuery(subaccountId);
    }

    history.push({
      pathname: `/signals/health-score/${facet.key}/${facetId}`,
      search,
      state: {
        date
      }
    });
  }

  render() {
    const {
      data, error, facet, loading, signalOptions, subaccounts, tableName, totalCount, hideTitle, header
    } = this.props;

    const subaccountFilter = _.get(signalOptions, 'subaccount.id');
    const isCustomRange = signalOptions.relativeRange === 'custom';

    const noFacetSelected = facet.key === 'sid';
    const noSubaccountFilter = subaccountFilter === undefined;

    return (
      <Panel>
        {/*
          This prop is only because v1 requires this title, but v2 does not.
          Should be removed once v2 is released.
        */}
        {!hideTitle && (
          <div className={styles.Header}>
            <h5>Health Score Summary</h5>
            <div className={styles.Tooltip}>
              <Tooltip
                children={<InfoOutline className={styles.TooltipIcon} size={18} />}
                content={HEALTH_SCORE_INFO}
                dark
                horizontalOffset="-1rem"
                right
              />
            </div>
          </div>
        )}
        {header && <Panel.Section>{header}</Panel.Section>}
        <SummaryTable
          data={data}
          empty={data.length === 0}
          error={error && error.message}
          loading={loading}
          tableName={tableName}
          totalCount={totalCount}
        >
          {(noSubaccountFilter || noFacetSelected) && (
            <Column
              dataKey="sid"
              label="Subaccount"
              sortable
              width={noFacetSelected ? '30%' : '15%'}
              component={({ sid }) => (
                <FacetDataCell
                  dimension="health-score"
                  facet="sid"
                  id={sid}
                  name={_.get(_.find(subaccounts, { id: sid }), 'name')}
                  truncate
                />
              )}
            />
          )}
          {!noFacetSelected && (
            <Column
              dataKey={facet.key}
              label={facet.label}
              sortable
              width={noSubaccountFilter ? '15%' : '30%'}
              component={(props) => (
                <FacetDataCell
                  dimension="health-score"
                  facet={facet.key}
                  id={props[facet.key]}
                  subaccountId={props.sid}
                  truncate
                />
              )}
            />
          )}
          <Column
            dataKey="history"
            label="Daily Health Score"
            width='30%'
            component={({ history, ...data }) => {
              const id = data[facet.key];

              return (
                <SparklineDataCell
                  data={history}
                  dataKey="health_score"
                  label="Health Score"
                  onClick={this.handleClick(id, data.sid)}
                  relative={false}
                />
              );
            }}
          />
          <Column
            align="right"
            dataKey="current_health_score"
            label={isCustomRange ? 'Score' : 'Current Score'}
            sortable
            width="12.5%"
            component={({ current_health_score }) => (
              <NumericDataCell value={current_health_score} />
            )}
          />
          <Column
            align="right"
            dataKey="WoW"
            label={<WoWHeaderCell/>}
            width="12.5%"
            component={({ WoW }) => (
              <WoWDataCell value={WoW} />
            )}
          />
          <Column
            align="right"
            dataKey="average_health_score"
            label="Average Score"
            width="15%"
            component={({ average_health_score }) => (
              <NumericDataCell value={average_health_score} />
            )}
          />
        </SummaryTable>
      </Panel>
    );
  }
}

export default HealthScoreOverview;
