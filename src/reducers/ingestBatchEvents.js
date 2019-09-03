// /api/v1/events/message?cursor=MTU2NzEwNjc5MjAwMCw5MzM1NTUxMzkzMjY3ODU0MA==&from=2019-08-29T18:28&to=2019-08-29T19:28&per_page=25
import qs from 'qs';

const initialState = {
  eventsByPage: [
    // [ page 1 ],
    // page 2,
    // page 3
  ],
  loadingStatus: 'init',
  // nextCursor
  // totalCount
};

export default (state = initialState, { type, payload, extra, meta }) => {
  switch (type) {
    case 'GET_INGEST_BATCH_EVENTS_PENDING': {
      if (!meta.params.cursor) {
        // reset events and nextCursor
        eventsByPage: []
      }

      return { ...state, loadingStatus: 'pending' };
    }

    case 'GET_INGEST_BATCH_EVENTS_FAIL':
      return { ...state, loadingStatus: 'fail' };

    case 'GET_INGEST_BATCH_EVENTS_SUCCESS': {
      if (!extra.links.next) {
        // unset nextCursor
      }

      return { ...state, loadingStatus: 'success', eventsByPage: [...eventsByPage, payload] };
    }

    // case 'SIGNALS_BATCH_STATUS_FETCH_SUCCESS':
    //   return {
    //     ...state,
    //     loading: false,
    //     error: null,
    //     totalCount: extra.total_count,
    //     cursorIndex: extra.links.next ? [ ...state.cursorIndex, extra.links.next] : state.cursorIndex,
    //     page: state.cursorIndex.length,
    //     hasMore: Boolean(extra.links.next),
    //   };

    // case 'SIGNALS_BATCH_STATUS_FETCH_FAIL':
    //   return {
    //     ...state,
    //     loading: false,
    //     error: payload
    //   };
    //
    // case 'SIGNALS_BATCH_STATUS_SET_PAGE':
    //   return {
    //     ...state,
    //     items: state.pageCache[state.cursorIndex[meta.page - 1]],
    //     page: meta.page
    //   };
  }

  return state;
};
