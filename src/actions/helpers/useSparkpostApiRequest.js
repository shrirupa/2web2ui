import { useState, useEffect } from 'react';
import { sparkpost as sparkpostAxios } from 'src/helpers/axiosInstances';
import store from 'src/store';
import _ from 'lodash';

function useSparkpostApiRequest(options) {
  const [response, setResponse] = useState({});

  // Force effect to rerun by using a toggled boolean as a dependant
  const [retryToggle, setRetryToggle] = useState(false);
  const retry = () => setRetryToggle(!retryToggle);

  const { auth } = store.getState();
  const httpOptions = { ...options };

  if (auth.loggedIn) {
    _.set(httpOptions, 'headers.Authorization', auth.token);
  }

  useEffect(() => {
    setResponse({ pending: true, error: null });

    sparkpostAxios(httpOptions).then((res) => {
      const results = _.get(res, 'data.results', res.data);
      setResponse({ pending: false, results });
    }).catch((error) => {
      setResponse({ pending: false, error: error });
    });
  }, [retryToggle]);

  return { ...response, retry };
}

export default useSparkpostApiRequest;
