import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';

export function uploadList(data) {
  return sparkpostApiRequest({
    type: 'UPLOAD_RECIPIENT_VALIDATION_LIST',
    meta: {
      method: 'POST',
      url: 'v1/recipient-validation',
      data
    }
  });
}
//TODO: Wait for endpoint
export function getList() {
  return { type: 'GET_JOB_LIST' };
  // return sparkpostApiRequest({
  //   type: 'GET_JOB_LIST',
  //   meta: {
  //     method: 'GET',
  //     url: 'v1/recipient-validation/list'
  //   }
  // });
}

//TODO: wait for endpoint
export function uploadListNew(data) {
  return { type: 'UPLOAD_RV_LIST_NEW' };
  // return sparkpostApiRequest({
  //   type: 'UPLOAD_RV_LIST_NEW',
  //   meta: {
  //     method: 'POST',
  //     url: 'v1/recipient-validation/list',
  //     data
  //   }
  // });
}

//TODO: wait for endpoint
export function triggerJob(listId) {
  return { type: 'TRIGGER_JOB' };
  // return sparkpostApiRequest({
  //   type: 'TRIGGER_JOB',
  //   meta: {
  //     method: 'POST',
  //     url: `v1/recipient-validation/${listId}`
  //   }
  // });
}

export function singleAddress(address) {
  return sparkpostApiRequest({
    type: 'SINGLE_RECIPIENT_VALIDATION',
    meta: {
      method: 'GET',
      url: `v1/recipient-validation/single/${address}`,
      email: address
    }
  });
}

export function getLatestJob() {
  return sparkpostApiRequest({
    type: 'GET_LATEST_JOB',
    meta: {
      method: 'GET',
      url: 'v1/recipient-validation/latest'
    }
  });
}

export function getJobStatus(list_id) {
  //TODO: Unmock action + fix tests
  return (dispatch, getState) => {
    if (!isAccountUiOptionSet('recipientValidationV2')(getState())) {
      return sparkpostApiRequest({
        type: 'GET_JOB_STATUS',
        meta: {
          method: 'GET',
          url: `v1/recipient-validation/job/${list_id}`
        }
      });
    } else {
      dispatch({
        type: 'GET_JOB_STATUS_SUCCESS',
        payload: {
          list_id: list_id,
          batch_status: 'queued_for_batch',
          complete: false,
          original_filename: 'test.csv',
          address_count: 1234,
          upload_timestamp: 1565187194
        }
      });
    }
  };
}

export function resetUploadError() {
  return {
    type: 'RESET_RECIPIENT_VALIDATION_ERROR'
  };
}
