const initialState = {
  loading: false,
  error: null,
  filters: {},
  items: [],
  totalCount: 0,
  hasMore: false,
  cursorIndex: ['initial'], // Append-only sequence of page cursors
  page: 1, // References cursorIndex, offset by 1 for humans
  pageCache: {} // Cached API results indexed by cursor, valid only for the current set of filters
};

export default (state = initialState, { type, payload, extra, meta }) => {
  switch (type) {
    case 'SIGNALS_BATCH_STATUS_RESET':
      return initialState;

    case 'SIGNALS_BATCH_STATUS_FETCH_PENDING':
      return {
        ...state,
        items: null,
        filters: meta.params,
        loading: true,
        error: null
      };

    case 'SIGNALS_BATCH_STATUS_FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        items: payload,
        totalCount: extra.total_count,
        cursorIndex: extra.links.next ? [ ...state.cursorIndex, extra.links.next] : state.cursorIndex,
        page: state.cursorIndex.length,
        hasMore: Boolean(extra.links.next),
        pageCache: {
          ...state.pageCache,
          [meta.params.cursor]: payload
        }
      };

    case 'SIGNALS_BATCH_STATUS_FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: payload
      };

    case 'SIGNALS_BATCH_STATUS_SET_PAGE':
      return {
        ...state,
        items: state.pageCache[state.cursorIndex[meta.page - 1]],
        page: meta.page
      };

    default:
      return state;
  }
};
