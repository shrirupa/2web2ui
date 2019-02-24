import { useState, useEffect } from 'react';
import { sparkpost as sparkpostAxios } from 'src/helpers/axiosInstances';
import store from 'src/store';
import _ from 'lodash';

function useSparkpostApiRequest(options) {
  const [response, setResponse] = useState({});
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
  }, []);
  // console.log(response);
  return response;
}

export default useSparkpostApiRequest;
