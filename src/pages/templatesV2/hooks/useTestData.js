import { useEffect, useMemo, useState } from 'react';
import isEqual from 'lodash/isEqual';

const useTestData = ({ draft = {}, templateTestData, version: mode, getTestDataFromLocalStorage, setTestDataToLocalStorage, isPublishedMode }) => {
  const [state, setState] = useState(templateTestData);

  //on mount, trigger fetching data from store
  useEffect(() => {
    getTestDataFromLocalStorage({ id: draft.id, mode });
  }, [draft.id, getTestDataFromLocalStorage, mode]);

  //update local state when testData is externally updated (e.g. completed loading from store)
  useEffect(() => {
    if (!isEqual(state, templateTestData)) {
      setState(templateTestData);
    }
  }, [setState, state, templateTestData]);

  //whenever data is changed locally, save it in localstorage.
  useEffect(() => {
    setTestDataToLocalStorage({ id: draft.id, data: state, mode });
  }, [state, draft.id, mode, setTestDataToLocalStorage]);

  const formattedData = useMemo(() => JSON.parse(state), [state]);

  return {
    formattedTestData: formattedData,
    testData: state,
    setTestData: setState
  };
};

export default useTestData;
