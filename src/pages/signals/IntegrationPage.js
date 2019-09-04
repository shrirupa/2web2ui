import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { CursorPaging, PerPageButtons, TableCollection } from 'src/components/collection';
import { getIngestBatchEvents } from 'src/actions/ingestBatchEvents.fake';
import DisplayDate from 'src/components/displayDate/DisplayDate';
import { formatDateTime } from 'src/helpers/date';
import Status from './components/tags/statusTags';
const IntegrationPage = ({ getIngestBatchEvents, eventsByPage, totalCount }) => {
  const columns = [
    'Timestamp', 'Status', 'Accepted', 'Batch ID'
  ];
  const [ page, setPage] = useState(0);
  const [ perPage, setPerPage] = useState(10);
  const formatRow = ({ timestamp, type, error_type, number_succeeded, number_failed, number_duplicates, batch_id }) => [
    <DisplayDate timestamp={timestamp} formattedDate={formatDateTime(timestamp)}/>,
    <Status status={type} error={error_type} />,
    <span>{number_succeeded}/{number_succeeded + number_failed + number_duplicates}</span>,
    <span>{batch_id}</span>
  ];
  const onChangePage = (nextPage) => {
    setPage(nextPage - 1);
  };
  const onChangePageSize = (pageSize) => {
    setPerPage(pageSize);
  };
  const onFirstPage = () => {
    setPage(0);
  };

  const nextCursor = ''; //TODO
  useEffect(() => {
    if (!eventsByPage[page]) {
      getIngestBatchEvents({ cursor: nextCursor, perPage });
    }
  },[eventsByPage, getIngestBatchEvents, page, perPage]);
  // console.log(eventsByPage);
  return (
    <Page title="Signals Integration">
      <p>Review the health of your Signals integration.</p>
      <TableCollection
        columns={columns}
        rows={eventsByPage[page] || []}
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
