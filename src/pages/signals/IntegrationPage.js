import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { CursorPaging, PerPageButtons, TableCollection } from 'src/components/collection';
import { getIngestBatchEvents } from 'src/actions/ingestBatchEvents';

const IntegrationPage = ({ getIngestBatchEvents }) => {
  const columns = [];
  const page = 1;
  const events = [];
  const hasMore = false;
  const formatRow = () => null;
  const perPage = 10;
  const totalCount = 1000;
  const onChangePage = () => {
    // if (backwards) {
    //   change current page no. (wouldn't require API request)
    // }

    // if (forwards) {
    //   make request with current filter and nextCursor
    // }

  };
  const onChangePageSize = () => {};
  const onFirstPage = () => {};

  useEffect(() => {
    getIngestBatchEvents({ cursor: nextCursor });
  }, []);

  return (
    <Page title="Signals Integration">
      <p>Review the health of your Signals integration.</p>
      <TableCollection
        columns={columns}
        rows={events}
        getRowData={formatRow}
        updateQueryString={false}
      />
      <CursorPaging
        currentPage={page}
        handlePageChange={onChangePage}
        previousDisabled={page <= 1}
        nextDisabled={!hasMore}
        handleFirstPage={onFirstPage}
        perPage={perPage}
        totalCount={totalCount}
      />
      <div>
        <PerPageButtons
          onPerPageChange={onChangePageSize}
          perPage={perPage}
          totalCount={totalCount}
        />
      </div>
    </Page>
  );
}

const mapStateToProps = (state) => ({
  /// something later
});

const mapDispatchToProps = {
  getIngestBatchEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationPage);
