import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { format, subDays } from 'date-fns';

export function getMessageEvents(params = {}) {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS',
    meta: {
      method: 'GET',
      url: '/message-events',
      params
    }
  });
}

export function getMessageHistory({ messageId, params = {}}) {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_HISTORY',
    meta: {
      method: 'GET',
      url: '/message-events',
      params: {
        ...params,
        message_ids: messageId,
        from: format(subDays(Date.now(), 10), 'YYYY-MM-DDTHH:MM')
      }
    }
  });
}

export function getDocumentation() {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS_DOCUMENTATION',
    meta: {
      method: 'GET',
      url: '/message-events/events/documentation'
    }
  });
}
