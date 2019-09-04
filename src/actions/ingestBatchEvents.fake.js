
const fakeRecord = {
  'retryable': false,
  'number_succeeded': 440,
  'event_id': '1d1941e9-4987-1a6c-b124-2a4328585721',
  'number_failed': 460,
  'batch_id': 'fbd59e4c-1629-4736-803d-201ff9fa8dd6',
  'expiration_timestamp': '2019-06-16T19:02:09.373Z',
  'error_type': 'validation',
  'href': 'https://api.sparkpost.com/ingest/number_failed/fbd59e4c-1629-4736-803d-201ff9fa8dd6',
  'type': 'error',
  'customer_id': 8675308,
  'subaccount_id': 38,
  'number_duplicates': 20,
  'timestamp': '2019-06-06T19:02:09.373Z'
};

const insertrecords = () => {
  const times = Math.floor(200 * Math.random());
  let arr = [];
  for (let i = 0; i < times; i++) { arr = [...arr, fakeRecord]; }

  return arr;

};
const events = insertrecords();
const length = events.length;

export const getIngestBatchEvents = (params) => (dispatch) => {
  dispatch({
    type: 'GET_INGEST_BATCH_EVENTS_PENDING',
    meta: { params }
  });

  const next = events.length > params.perPage
    ? '/api/v1/events/message?cursor=MTU2NzEwNjc5MjAwMCw5MzM1NTUxMzkzMjY3ODU0MA==&from=2019-08-29T18:28&to=2019-08-29T19:28&per_page=25'
    : undefined;


  dispatch({
    type: 'GET_INGEST_BATCH_EVENTS_SUCCESS',
    extra: {
      'total_count': length,
      'links': { next }
    },
    meta: { params },
    payload: events.splice(0, params.perPage)
  });
};




























// import moment from 'moment';
// import BatchStatusSearch from 'src/pages/signals/components/BatchStatusSearch';


//   // (dispatch) => {
//   //   dispatch({ type: 'SIGNALS_BATCH_STATUS_FETCH_PENDING', meta: { filters: params }});
//   //
//   //   return getMockBatchStatusEvents({ perPage: params.per_page })
//   //     .then((fakeResults) => dispatch({
//   //       type: 'SIGNALS_BATCH_STATUS_FETCH_SUCCESS',
//   //       payload: fakeResults.results,
//   //       meta: { params },
//   //       extra: fakeResults.extra
//   //     }));
//   // };
//
// export const signalsBatchStatusInit = () => ({
//   type: 'SIGNALS_BATCH_STATUS_RESET'
// });
//
// export const signalsBatchStatusReset = (filters) => (dispatch) => {
//   dispatch(signalsBatchStatusInit());
//   return dispatch(
//     getBatchStatusEvents({ ...filters, cursor: 'initial' })
//   );
// };
//
// export const signalsBatchStatusNextPage = () => (dispatch, getState) => {
//   const { cursorIndex, page, filters, pageCache } = getState().signalsBatchStatus;
//   if (page >= cursorIndex.length) {
//     throw new Error('nextPage: attempt to move beyond last page');
//   }
//   const cursor = cursorIndex[page];
//   if (cursor in pageCache) {
//     return dispatch({
//       type: 'SIGNALS_BATCH_STATUS_SET_PAGE',
//       meta: { page: page + 1 }
//     });
//   }
//   return dispatch(
//     getBatchStatusEvents({ ...filters, cursor })
//   );
// };
//
// export const signalsBatchStatusPrevPage = () => (dispatch, getState) => {
//   const { cursorIndex, page, pageCache } = getState().signalsBatchStatus;
//   if (page <= 1) {
//     throw new Error('prevPage: attempt to move beyond first page');
//   }
//   const cursor = cursorIndex[page - 1];
//   if (!(cursor in pageCache)) {
//     throw new Error(`cursor ${cursor} at page ${page} missing from cache`);
//   }
//   return dispatch({
//     type: 'SIGNALS_BATCH_STATUS_SET_PAGE',
//     meta: { page: page - 1 }
//   });
// };
//
//
// const pick = (array) => array[Math.floor(Math.random() * array.length)];
// const totalMockCount = 207;
// export const getMockBatchStatusEvents = ({ page = 0, perPage = 10 }) =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         results: Array(perPage)
//           .fill()
//           .map((_, idx) => {
//             const error = Math.random() > 0.5;
//             return {
//               timestamp: moment().subtract(idx * 2 + 1, 'hours'),
//               type: error ? 'error' : 'success',
//               error_type: error
//                 ? pick(BatchStatusSearch.batchStatusOptions.slice(1).map((errType) => errType.value))
//                 : null,
//               batch_id: 'DB9B0E4D-0917-4709-A915-D6B80221BC7F',
//               number_succeeded: 100,
//               number_failed: error ? 3 : null,
//               number_duplicates: 21
//             };
//           }),
//         extra: {
//           total_count: totalMockCount,
//           links: {
//             next: page < Math.ceil(totalMockCount / perPage) ? String(Math.random()) : null
//           }
//         }
//       });
//     }, 1000);
//   });
