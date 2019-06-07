import React from 'react';

import { Tag } from '@sparkpost/matchbox';
import { Warning, CheckCircle } from '@sparkpost/matchbox-icons';
import { TableCollection, CursorPaging, PerPageButtons, Empty } from 'src/components';
import DisplayDate from 'src/components/displayDate/DisplayDate';
import { formatDateTime } from 'src/helpers/date';
import { DEFAULT_PER_PAGE_BUTTONS } from 'src/constants';
import styles from './BatchStatusCollection.module.scss';

const friendlyErrorTypeMap = {
  validation: 'Validation error',
  system: 'System error',
  decompress: 'Decompression error',
  duplicate_batch: 'Duplicate batch',
  empty_batch: 'Empty batch'
};

const Status = ({ status, error }) => {
  const isError = status !== 'success';
  const icon = isError ? <Warning color="#fa6423" /> : <CheckCircle color="#9bcd5a" />;
  const msg = isError ? friendlyErrorTypeMap[error] : 'Success';
  return (
    <Tag className={styles.StatusTag}>
      {icon} {msg}
    </Tag>
  );
};

const columns = [
  { label: 'Timestamp', width: '18%' },
  'Status',
  { label: 'Ingested/Rejected/Duplicates', width: '25%' },
  'Batch ID'
];

const formatRow = ({
  timestamp,
  type,
  error_type = '',
  batch_id,
  number_succeeded,
  number_failed,
  number_duplicates
}) => [
  <DisplayDate timestamp={timestamp} formattedDate={formatDateTime(timestamp)} />,
  <Status status={type} error={error_type} />,
  `${number_succeeded} / ${number_failed === null ? 0 : number_failed} / ${number_duplicates}`,
  batch_id
];

const BatchStatusCollection = ({
  events,
  totalCount,
  hasMore,
  page,
  perPage,
  onFirstPage,
  onChangePage,
  onChangePageSize
}) =>
  events.length === 0 ? (
    <Empty message="No batch events to display" />
  ) : (
    <>
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
      <div className={styles.RightAlignedButtons}>
        <PerPageButtons
          totalCount={totalCount}
          data={events}
          onPerPageChange={onChangePageSize}
          perPageButtons={DEFAULT_PER_PAGE_BUTTONS}
          perPage={perPage}
          saveCsv={true}
        />
      </div>
    </>
  );

export default BatchStatusCollection;
