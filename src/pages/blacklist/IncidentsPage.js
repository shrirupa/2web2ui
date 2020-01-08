import React, { useEffect } from 'react';
import { Page } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { ApiErrorBanner, Loading } from 'src/components';
import { Users } from 'src/components/images';
import { listMonitors, listIncidents } from 'src/actions/blacklist';
import { selectIncidentsList } from 'src/selectors/blacklist';
import IncidentsCollection from './components/IncidentsCollection';
import styles from './IncidentsPage.module.scss';
import CongratsBanner from './components/CongratsBanner';

export const IncidentsPage = props => {
  const { loading, error, listMonitors, listIncidents, monitors, incidents } = props;

  useEffect(() => {
    listMonitors();
    listIncidents();
  }, [listMonitors, listIncidents]);

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
        <IncidentsCollection incidents={incidents} />
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
            Monitor blacklists for your domains and IPs so you know when your deliverability will be
            affected.
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
        Monitor blacklists for your domains and IPs so you know when your deliverability will be
        affected.
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
