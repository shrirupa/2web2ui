/* eslint-disable max-lines */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Page } from '@sparkpost/matchbox';
import { PanelLoading, TableCollection, CursorPaging, PerPageButtons, ApiErrorBanner, Empty } from 'src/components';
import MessageEventsSearch from './components/MessageEventsSearch';
import { getMessageEvents, changePage, getMessageEventsCSV, clearCSV } from 'src/actions/messageEvents';
import { selectMessageEvents, selectMessageEventsCSV } from 'src/selectors/messageEvents';
import { formatToCsv, download } from 'src/helpers/downloading';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import _ from 'lodash';
import styles from './MessageEventsPage.module.scss';
import MessageEventRow from './components/MessageEventRow';

const errorMsg = 'Sorry, we seem to have had some trouble loading your message events.';
const emptyMessage = 'There are no message events for your current query';

const columns = [
  { label: 'Event' },
  { label: 'Subject' },
  { label: 'Recipient' },
  { label: 'From' },
  { label: 'Timestamp' }
];

export class MessageEventsPage extends Component {

  state = {
    currentPage: 1,
    perPage: 25
  }

  componentDidUpdate(prevProps) {
    const { search, getMessageEvents, eventsCSV } = this.props;
    const { perPage } = this.state;
    //Refresh the page & load new data if the search filters have changed
    if (!_.isEqual(prevProps.search, search)) {
      this.setState({ currentPage: 1 });
      getMessageEvents({ perPage, ...search });
    }
    if (!prevProps.eventsCSV.length && eventsCSV.length) {
      this.downloadCSV();
    }
  }

  downloadCSV = () => {
    const { eventsCSV, clearCSV } = this.props;
    const url = formatToCsv({ data: eventsCSV, returnBlob: true });
    const now = Math.floor(Date.now() / 1000);
    download({ name: `sparkpost-csv-${now}.csv`, url });
    clearCSV();
  };

  handlePageChange = (currentPage) => {
    this.setState({ currentPage });
    const { changePage } = this.props;
    return changePage(currentPage);
  }

  handlePerPageChange = (perPage) => {
    const { search, getMessageEvents } = this.props;
    this.setState({ perPage, currentPage: 1 });
    getMessageEvents({ perPage, ...search });
  }

  //Reload the first page w/ api call, NOT from cache
  handleFirstPage = () => {
    const { search, getMessageEvents } = this.props;
    const { perPage } = this.state;
    this.setState({ currentPage: 1 });
    getMessageEvents({ perPage, ...search });
  }

  isPreviousDisabled = () => {
    const { currentPage } = this.state;
    return currentPage <= 1;
  }

  isNextDisabled = () => {
    const { hasMorePagesAvailable } = this.props;
    return !hasMorePagesAvailable;
  }

  getCSV = () => {
    const { search, getMessageEventsCSV } = this.props;
    getMessageEventsCSV(search);
  }

  renderError() {
    const { error, getMessageEvents, search } = this.props;
    return (
      <ApiErrorBanner
        message={errorMsg}
        errorDetails={error.message}
        reload={() => getMessageEvents(search)}
      />
    );
  }

  renderCollection() {
    const { events, empty, loading, totalCount, eventsCSVLoading } = this.props;
    const { currentPage, perPage } = this.state;

    if (loading) {
      return <PanelLoading />;
    }

    const RowComponent = (row) => <MessageEventRow event={row}></MessageEventRow>;

    const content = empty
      ? <Empty message={emptyMessage} />
      : (
        <div>
          <TableCollection
            columns={columns}
            rows={events}
            rowComponent={RowComponent}
            defaultSortColumn='timestamp'
            defaultSortDirection='desc'
          />
          <CursorPaging
            currentPage={currentPage}
            handlePageChange = {this.handlePageChange}
            previousDisabled={this.isPreviousDisabled()}
            nextDisabled={this.isNextDisabled()}
            handleFirstPage={this.handleFirstPage}
            perPage={perPage}
            totalCount={totalCount}
          />
          <div className={styles.RightAlignedButtons}>
            <PerPageButtons
              totalCount={totalCount}
              data={events}
              onPerPageChange={this.handlePerPageChange}
              perPageButtons={DEFAULT_PER_PAGE_BUTTONS}
              perPage={perPage}
              saveCsv={true}
            />
            <Button onClick={this.getCSV} disabled={eventsCSVLoading}>
              {(eventsCSVLoading) ? 'Saving CSV...' : 'Save as CSV'}
            </Button>
          </div>
        </div>
      );

    return content;
  }

  render() {
    const { error } = this.props;

    return (
      <Page title='Events Search'>
        <MessageEventsSearch />
        {error ? this.renderError() : this.renderCollection()}
      </Page>
    );
  }

}

const mapStateToProps = (state) => {
  const events = selectMessageEvents(state);
  const eventsCSV = selectMessageEventsCSV(state);
  const { messageEvents } = state;
  const { loading, error, search, totalCount, hasMorePagesAvailable, eventsCSVLoading } = messageEvents;
  return {
    events: events,
    loading,
    error,
    empty: events.length === 0,
    search,
    totalCount,
    hasMorePagesAvailable,
    eventsCSV,
    eventsCSVLoading
  };
};

export default connect(mapStateToProps, { getMessageEvents, getMessageEventsCSV, changePage, clearCSV })(MessageEventsPage);
