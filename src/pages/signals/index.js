import ComplaintsByCohortPage from './ComplaintsByCohortPage';
import EngagementRateByCohortPage from './EngagementRateByCohortPage';
import EngagementRecencyPage from './EngagementRecencyPage';
import HealthScorePage from './HealthScorePage';
import SpamTrapPage from './SpamTrapPage';
import UnsubscribeRateByCohortPage from './UnsubscribeRateByCohortPage';
import BatchStatusPage from './BatchStatusPage';
import * as dashboards from './dashboards';

export default {
  ComplaintsByCohortPage,
  EngagementRateByCohortPage,
  EngagementRecencyPage,
  HealthScorePage,
  SpamTrapPage,
  UnsubscribeRateByCohortPage,
  BatchStatusPage,
  ...dashboards
};
