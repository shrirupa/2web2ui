import { dedupeFilters } from 'src/helpers/reports';
import { getMetricsFromKeys } from 'src/helpers/metrics';
import config from 'src/config';

const initialState = {
  relativeRange: 'day',
  filters: [],
  metrics: getMetricsFromKeys(config.summaryChart.defaultMetrics)
};

export default (state = initialState, action) => {
  switch (action.type) {

    case 'REFRESH_REPORT_OPTIONS': {
      const { to = state.to, from = state.from, relativeRange = state.relativeRange, metrics = state.metrics } = action.payload;
      return { ...state, to, from, relativeRange, metrics };
    }

    case 'ADD_FILTERS': {
      const mergedFilters = dedupeFilters([ ...state.filters, ...action.payload ]);
      if (mergedFilters.length === state.filters.length) {
        return state;
      }
      return { ...state, filters: mergedFilters };
    }

    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: [
          ...state.filters.slice(0, action.payload),
          ...state.filters.slice(action.payload + 1)
        ]
      };

    case 'CLEAR_FILTERS':
      return { ...state, filters: []};

    default:
      return state;
  }
};
