import React, { useState, useEffect, useCallback } from 'react';
import { Page } from '@sparkpost/matchbox';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';

import { PanelLoading, ApiErrorBanner } from 'src/components';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';

import withIngestBatchStatus from './containers/withIngestBatchStatus';

import { boolean, array, string, number, date, useQueryParams } from './hooks/useQueryParams';

import BatchStatusCollection from './components/BatchStatusCollection';
import BatchStatusSearch from './components/BatchStatusSearch';
import { comparableJson } from './helpers/hooks';

const Error = ({ error, reload }) => (
  <ApiErrorBanner
    message="Sorry, we had some trouble loading your events."
    errorDetails={error.message}
    reload={reload}
  />
);

const defaultRange = 'hour';
const queryParamSchema = {
  errorTypes: array,
  showSuccessful: boolean,
  batchIds: string,
  relativeRange: { type: string, default: defaultRange },
  from: date,
  to: date,
  perPage: { type: number, default: DEFAULT_PER_PAGE_BUTTONS[0] }
};

const withoutEmptyValues = (obj) => pickBy(obj, identity);
const paramsToApi = ({ errorTypes, showSuccessful, batchIds, from, to, perPage }) =>
  withoutEmptyValues({
    events: ['error', showSuccessful && 'success'].filter(Boolean).join(','),
    error_types: errorTypes,
    batch_ids: batchIds,
    from: from && from.toISOString(),
    to: to && to.toISOString(),
    per_page: perPage
  });

export const BatchStatusPage = ({
  loading,
  items,
  error,
  page,
  totalCount,
  hasMore,
  signalsBatchStatusReset,
  signalsBatchStatusNextPage,
  signalsBatchStatusPrevPage
}) => {
  const now = useState(new Date())[0];

  // We use the query string as our search state. Changing the params triggers
  // an API request with filters derived from the new search state.
  //
  // On mount, we parse the initial query string and apply defaults. The result
  // is used to make an initial API request.
  const { params, setParams } = useQueryParams(queryParamSchema);

  // Propagate filter state changes to query params
  const updateFilters = useCallback(
    (newFilters) => {
      setParams({ ...params, ...newFilters });
    },
    [params, setParams]
  );

  // Load the first page of latest events when the user hits rewind
  const rewindToLatest = useCallback(
    () => {
      signalsBatchStatusReset(paramsToApi(params));
    },
    [params, signalsBatchStatusReset]
  );

  const goToPage = useCallback(
    (newPage) => {
      if (newPage === page + 1) {
        return signalsBatchStatusNextPage();
      }
      if (newPage === page - 1) {
        return signalsBatchStatusPrevPage();
      }
      throw new Error('goToPage: page + or - 1 only');
    },
    [page, signalsBatchStatusNextPage, signalsBatchStatusPrevPage]
  );

  const setPerPage = useCallback(
    (newPerPage) => {
      updateFilters({ perPage: newPerPage });
    },
    [updateFilters]
  );

  const retryAfterError = useCallback(
    () => {
      signalsBatchStatusReset(paramsToApi(params));
    },
    [params, signalsBatchStatusReset]
  );

  // Reset the page cache and load a new first page whenever our filters change
  // (Either on mount or when filter state changes - see above)
  useEffect(
    () => {
      rewindToLatest();
    },
    [comparableJson(params), signalsBatchStatusReset] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Page title="Ingestion Status">
      <p>Review the health of your Signals integration.</p>
      <BatchStatusSearch
        now={now}
        disabled={loading || Boolean(error)}
        filters={params}
        onFilterChange={updateFilters}
      />
      {error && <Error error={error} reload={retryAfterError} />}
      {loading && <PanelLoading />}
      {!(error || loading) && (
        <BatchStatusCollection
          events={items}
          totalCount={totalCount}
          hasMore={hasMore}
          page={page}
          perPage={params.perPage}
          onFirstPage={rewindToLatest}
          onChangePage={goToPage}
          onChangePageSize={setPerPage}
        />
      )}
    </Page>
  );
};

export default withIngestBatchStatus(BatchStatusPage);
