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
