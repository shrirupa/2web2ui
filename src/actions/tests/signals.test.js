import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../signals';
jest.mock('src/actions/helpers/sparkpostApiRequest');
jest.mock('src/helpers/date', () => ({
  formatInputDate: (d) => d
}));

describe('Signals Actions', () => {
  const requiredOptions = {
    from: '2018-01-12',
    to: '2018-01-13'
  };

  snapshotActionCases('.getSpamHits', {
    'by default': {
      action: () => actions.getSpamHits({ ...requiredOptions })
    },
    'with a facet': {
      action: () => actions.getSpamHits({ ...requiredOptions, facet: 'sending-domain' })
    },
    'with a subaccount facet': {
      action: () => actions.getSpamHits({ ...requiredOptions, facet: 'sid', filter: 123 })
    },
    'with a filter': {
      action: () => actions.getSpamHits({ ...requiredOptions, filter: 'examp' })
    },
    'with a limit': {
      action: () => actions.getSpamHits({ ...requiredOptions, limit: 100 })
    },
    'with a offset': {
      action: () => actions.getSpamHits({ ...requiredOptions, offset: 9 })
    },
    'with an order': {
      action: () => actions.getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'example_field' })
    },
    'with a order by subaccount': {
      action: () => actions.getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'sid' })
    },
    'with a order field that needs to be mapped': {
      action: () => actions.getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'current_trap_hits' })
    },
    'with a subaccount': {
      action: () => actions.getSpamHits({ ...requiredOptions, subaccount: { id: 123 }})
    }
  });

  snapshotActionCases('.getEngagementRecency', {
    'by default': {
      action: () => actions.getEngagementRecency({ ...requiredOptions })
    }
  });

  snapshotActionCases('.getEngagementRateByCohort', {
    'by default': {
      action: () => actions.getEngagementRateByCohort({ ...requiredOptions })
    }
  });

  snapshotActionCases('.getUnsubscribeRateByCohort', {
    'by default': {
      action: () => actions.getUnsubscribeRateByCohort({ ...requiredOptions })
    }
  });

  snapshotActionCases('.getComplaintsByCohort', {
    'by default': {
      action: () => actions.getComplaintsByCohort({ ...requiredOptions })
    }
  });

  snapshotActionCases('.getHealthScore', {
    'by default': {
      action: () => actions.getHealthScore({ ...requiredOptions })
    },
    'with an order by subaccount': {
      action: () => actions.getHealthScore({ ...requiredOptions, order: 'asc', orderBy: 'sid' })
    },
    'with a mailbox provider filter': {
      action: () => actions.getHealthScore({ ...requiredOptions, facet: 'mb_provider', filter: 'Google Ap' })
    }
  });

  snapshotActionCases('.getCurrentHealthScore', {
    'by default': {
      action: () => actions.getCurrentHealthScore({ ...requiredOptions })
    }
  });
});
