export const initialState = {
  blacklistsPending: false,
  blacklists: [],
  blacklistsError: null,
  monitorsPending: false,
  monitors: [],
  monitorsError: null,
  incidentsPending: false,
  incidents: [],
  incidentsError: null,
  deleteMonitorPending: false,
  deleteMonitorError: null,
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_BLACKLISTS_PENDING':
      return { ...state, blacklistsPending: true, blacklistsError: null };
    case 'LIST_BLACKLISTS_FAIL':
      return { ...state, blacklistsPending: false, blacklistsError: payload };
    case 'LIST_BLACKLISTS_SUCCESS':
      return { ...state, blacklists: payload, blacklistsPending: false, blacklistsError: null };

    case 'LIST_MONITORS_PENDING':
      return { ...state, monitorsPending: true, monitorsError: null };
    case 'LIST_MONITORS_FAIL':
      return { ...state, monitorsPending: false, monitorsError: payload };
    case 'LIST_MONITORS_SUCCESS':
      return { ...state, monitors: payload, monitorsPending: false, monitorsError: null };

    case 'LIST_INCIDENTS_PENDING':
      return { ...state, incidentsPending: true, incidentsError: null };
    case 'LIST_INCIDENTS_FAIL':
      return { ...state, incidentsPending: false, incidentsError: payload };
    case 'LIST_INCIDENTS_SUCCESS':
      return { ...state, incidents: payload, incidentsPending: false, incidentsError: null };

    case 'GET_INCIDENT_PENDING':
      return { ...state, incidentPending: true, incidentError: null };
    case 'GET_INCIDENT_FAIL':
      return { ...state, incidentPending: false, incidentError: payload };
    case 'GET_INCIDENT_SUCCESS':
      return { ...state, incident: payload, incidentPending: false, incidentError: null };

    case 'LIST_INCIDENTS_FOR_RESOURCE_PENDING':
      return { ...state, incidentsForResourcePending: true, incidentsForResourceError: null };
    case 'LIST_INCIDENTS_FOR_RESOURCE_FAIL':
      return { ...state, incidentsForResourcePending: false, incidentsForResourceError: payload };
    case 'LIST_INCIDENTS_FOR_RESOURCE_SUCCESS':
      return {
        ...state,
        incidentsForResource: payload,
        incidentsForResourcePending: false,
        incidentsForResourceError: null,
      };

    case 'LIST_INCIDENTS_FOR_BLACKLIST_PENDING':
      return { ...state, incidentsForBlacklistPending: true, incidentsForBlacklistError: null };
    case 'LIST_INCIDENTS_FOR_BLACKLIST_FAIL':
      return { ...state, incidentsForBlacklistPending: false, incidentsForBlacklistError: payload };
    case 'LIST_INCIDENTS_FOR_BLACKLIST_SUCCESS':
      return {
        ...state,
        incidentsForBlacklist: payload,
        incidentsForBlacklistPending: false,
        incidentsForBlacklistError: null,
      };

    case 'LIST_HISTORICAL_INCIDENTS_PENDING':
      return { ...state, historicalIncidentsPending: true, historicalIncidentsError: null };
    case 'LIST_HISTORICAL_INCIDENTS_FAIL':
      return { ...state, historicalIncidentsPending: false, historicalIncidentsError: payload };
    case 'LIST_HISTORICAL_INCIDENTS_SUCCESS':
      return {
        ...state,
        historicalIncidents: payload,
        historicalIncidentsPending: false,
        historicalIncidentsError: null,
      };

    case 'ADD_WATCHLIST_PENDING':
      return { ...state, watchlistAddPending: true, watchlistAddError: null };
    case 'ADD_WATCHLIST_FAIL':
      return { ...state, watchlistAddPending: false, watchlistAddError: payload };
    case 'ADD_WATCHLIST_SUCCESS':
      return { ...state, watchlistAddPending: false, watchlistAddError: null };

    case 'DELETE_MONITOR_PENDING':
      return { ...state, deleteMonitorPending: true, deleteMonitorError: null };
    case 'DELETE_MONITOR_FAIL':
      return { ...state, deleteMonitorPending: false, deleteMonitorError: payload };
    case 'DELETE_MONITOR_SUCCESS':
      return {
        ...state,
        deleteMonitorPending: false,
        deleteMonitorError: null,
        monitors: state.monitors.filter(a => a.resource !== meta.resource),
      };
    default:
      return state;
  }
};
