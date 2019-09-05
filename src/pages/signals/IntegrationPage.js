import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'src/components/datePicker/DatePicker';
import { Page, Tabs, Panel, Grid, TextField } from '@sparkpost/matchbox';
import { CursorPaging, PerPageButtons, TableCollection } from 'src/components/collection';
import { getIngestBatchEvents } from 'src/actions/ingestBatchEvents.fake';
import DisplayDate from 'src/components/displayDate/DisplayDate';
import Loading from 'src/components/loading';
import { formatDateTime } from 'src/helpers/date';
import Status from './components/tags/statusTags';
import useTabs from 'src/hooks/useTabs';
import FilterDropdown from './components/FilterDropdown';
import { batchStatusOptions } from './constants/integration';
import { FORMATS, RELATIVE_DATE_OPTIONS } from 'src/constants';
import { getRelativeDates } from 'src/helpers/date';
import moment from 'moment';

const useDateRange = (initialDateRange) => {
  const [dateRange, setDateRange] = useState(() => getRelativeDates(initialDateRange));

  return [
    dateRange,
    (obj) => {
      if (obj.relativeRange === 'custom') {
        setDateRange(obj);
        return;
      }

      const nextDateRange = getRelativeDates(obj.relativeRange);

      setDateRange(nextDateRange);
    }
  ];
};

const initialTabs = [
  { content: 'Filter By Date/Status' },
  { content: 'Filter By Batch ID' }];
const IntegrationPage = ({ getIngestBatchEvents, eventsByPage, totalCount, nextCursor, loadingStatus }) => {
  const columns = [
    'Timestamp', 'Status', 'Accepted', 'Batch ID'
  ];
  const [ page, setPage] = useState(0);
  const [ perPage, setPerPage] = useState(10);
  const [dateRange, setDateRange] = useDateRange(RELATIVE_DATE_OPTIONS[1]);

  const [ selectedTab, tabs] = useTabs(initialTabs);
  const formatRow = ({ timestamp, type, error_type, number_succeeded, number_failed, number_duplicates, batch_id }) => [
    <DisplayDate timestamp={timestamp} formattedDate={formatDateTime(timestamp)}/>,
    <Status status={type} error={error_type} />,
    <span>{number_succeeded}/{number_succeeded + number_failed + number_duplicates}</span>,
    <span>{batch_id}</span>
  ];
  const onChangePage = (nextPage) => {
    setPage(nextPage - 1);
  };
  const onChangePageSize = (perPage) => {
    setPage(0);
    setPerPage(perPage);
    getIngestBatchEvents({ perPage });

  };
  const onFirstPage = () => {
    setPage(0);
  };
  const events = eventsByPage[page];


  const handleDateChange = (obj) => {
    setDateRange(obj);
  };
  useEffect(() => { // fetch data when page changes and on initial page load
    if (!events) {
      getIngestBatchEvents({ cursor: nextCursor, perPage });
    }
  },[events, getIngestBatchEvents, nextCursor, perPage]);

  if (!events) {
    return <Loading />;
  }



  return (
    <Page title="Signals Integration">
      <p>Review the health of your Signals integration.</p>

      <Tabs
        selected={selectedTab}
        connectBelow={true}
        tabs={tabs}
      />
      <Panel sectioned>
        {selectedTab === 0 &&
        <Grid>
          <Grid.Column xs={12} md={6} >
            <DatePicker
              roundToPrecision={false}
              disabled={loadingStatus === 'pending'}
              dateFieldFormat={FORMATS.DATETIME}
              relativeDateOptions={RELATIVE_DATE_OPTIONS}
              {...dateRange}
              datePickerProps={{
                disabledDays: {
                  after: moment().toDate(),
                  before: moment().subtract(7, 'days').toDate()
                }
              }}
              onChange={handleDateChange}
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6}>
            <FilterDropdown
              label="Batch Status"
              options={batchStatusOptions}
              initialSelected={'success'}
              onChange={() => {}}
            />
          </Grid.Column>
        </Grid>
        }
        {selectedTab === 1 &&
         <TextField
           labelHidden
           name='batchIds'
           placeholder="Filter by batch ID"
         />
        }
      </Panel>
      <TableCollection
        columns={columns}
        rows={events}
        getRowData={formatRow}
        updateQueryString={false}
      />
      <CursorPaging
        key={page}
        currentPage={page + 1}
        handlePageChange={onChangePage}
        previousDisabled={page === 0}
        nextDisabled={totalCount <= perPage * (page + 1)}//REDO ON NEXT CURSOR
        handleFirstPage={onFirstPage}
        perPage={perPage}
        totalCount={totalCount}
      />
      <PerPageButtons
        onPerPageChange={onChangePageSize}
        perPage={perPage}
        totalCount={totalCount}
      />
    </Page>
  );
};

const mapStateToProps = (state) => ({
  ...state.ingestBatchEvents
});

const mapDispatchToProps = {
  getIngestBatchEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationPage);
