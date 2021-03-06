import React, { useEffect, useState } from 'react';
import { Page } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { ApiErrorBanner, Loading } from 'src/components';
import { Users } from 'src/components/images';
import { listMonitors, listIncidents } from 'src/actions/blacklist';
import { selectIncidentsList } from 'src/selectors/blacklist';
import { getRelativeDates } from 'src/helpers/date';
import usePageFilters from 'src/hooks/usePageFilters';
import IncidentsCollection from './components/IncidentsCollection';
import styles from './IncidentsPage.module.scss';
import CongratsBanner from './components/CongratsBanner';

const filterWhitelist = {
  search: {},
};

export const IncidentsPage = props => {
  const { loading, error, listMonitors, listIncidents, monitors, incidents } = props;

  const currentDateTime = new Date();
  const [to, setTo] = useState(currentDateTime);
  const [from, setFrom] = useState(
    moment(currentDateTime)
      .subtract(30, 'days')
      .toDate(),
  );
  const [relativeRange, setRelativeRange] = useState('30days');

  const updateDateRange = ({ from, to, relativeRange }) => {
    if (to && from && relativeRange) {
      setTo(to);
      setFrom(from);
      setRelativeRange(relativeRange);
    } else {
      const dateRangeFromRelativeDate = getRelativeDates(relativeRange);
      setTo(dateRangeFromRelativeDate.to);
      setFrom(dateRangeFromRelativeDate.from);
      setRelativeRange(dateRangeFromRelativeDate.relativeRange);
    }
  };

  const { filters, updateFilters } = usePageFilters(filterWhitelist);

  const updateTextField = newSearch => {
    if (filters.search !== newSearch) {
      updateFilters({
        search: newSearch,
      });
    }
  };

  const dateOptions = {
    to,
    from,
    relativeRange,
  };

  useEffect(() => {
    listMonitors();
  }, [listMonitors]);

  useEffect(() => {
    listIncidents(from, to);
  }, [from, to, listIncidents]);

  if (loading) {
    return <Loading />;
  }

  const renderContent = () => {
    if (error) {
      return (
        <div data-id="error-banner">
          <ApiErrorBanner
            message={'Sorry, we seem to have had some trouble loading your blacklist incidents.'}
            errorDetails={error.message}
            reload={() => {
              listMonitors();
              listIncidents();
            }}
          />
        </div>
      );
    }

    return (
      <div data-id="incidents-table">
        {incidents.length === 0 && (
          <CongratsBanner
            title="Congratulations! You are not currently on a Blacklist."
            content="There are no incidents reported for items on your watchlist"
          />
        )}
        <IncidentsCollection
          incidents={incidents}
          dateOptions={dateOptions}
          updateDateRange={updateDateRange}
          updateTextField={updateTextField}
          search={filters.search}
        />
      </div>
    );
  };

  return (
    <Page
      empty={{
        show: monitors.length === 0,
        title: 'Blacklist Reports',
        image: Users,
        content: (
          <p>
            Keep an eye on your Domains and IPs and maintain a healthy sender reputation and improve
            your deliverability
          </p>
        ),
      }}
      title="Blacklist Incidents"
      primaryAction={{
        content: monitors.length === 0 ? 'Add to Watchlist' : 'View Watchlist',
        to: monitors.length === 0 ? '/blacklist/watchlist/add' : '/blacklist/watchlist',
        component: Link,
      }}
    >
      <p className={styles.Description}>
        Check the current status of blacklists and learn more about what actions you can take to
        remedy and prevent future blacklisting.
      </p>
      {renderContent()}
    </Page>
  );
};

const mapStateToProps = state => ({
  incidents: selectIncidentsList(state),
  monitors: state.blacklist.monitors,
  error: state.blacklist.incidentsError || state.blacklist.monitorsError,
  loading: state.blacklist.incidentsPending || state.blacklist.monitorsPending,
});
export default connect(mapStateToProps, { listMonitors, listIncidents })(IncidentsPage);
