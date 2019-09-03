import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export const getIngestBatchEvents = ({
  batchIds = [],
  cursor,
  from,
  perPage,
  statuses = [],
  to
}) => (
  sparkpostApiRequest({
    type: 'GET_INGEST_BATCH_EVENTS',
    meta: {
      method: 'GET',
      url: 'v1/events/ingest',
      showErrorAlert: false,
      params: {
        batch_ids: batchIds.length ? batchIds.join(', ') : undefined,
        cursor,
        events: statuses.length ? statuses.join(', ') : undefined,
        from,
        per_page: perPage,
        to
      }
    }
  })
);
