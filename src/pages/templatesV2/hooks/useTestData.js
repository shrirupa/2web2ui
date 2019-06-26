import { useEffect, useMemo, useState } from 'react';
import isEqual from 'lodash/isEqual';

const useTestData = ({ draft = {}, templateTestData, getTestDataFromLocalStorage, setTestDataToLocalStorage, isPublishedMode }) => {
  const [state, setState] = useState(templateTestData);
  const templateId = draft.id;
  const mode = isPublishedMode ? 'published' : 'draft';

  //trigger fetching data from store.
  useEffect(() => {
    getTestDataFromLocalStorage({ id: templateId, mode });
  }, [getTestDataFromLocalStorage, mode, templateId]);

  //update local state when testData is externally updated (e.g. completed loading from store)
  useEffect(() => {
    setState(templateTestData);
  }, [templateTestData, mode]);

  const formattedData = useMemo(() => {
    try {
      return JSON.parse(state);
    } catch (err) {
      return {};
    }
  }, [state]);

  const syncTestDataInStorage = () => {
    if (!isEqual(templateTestData, state)) {
      setTestDataToLocalStorage({ id: templateId, data: state, mode });
    }
  };

  return {
    formattedTestData: formattedData,
    testData: state,
    setTestData: setState,
    syncTestDataInStorage
  };
};

export default useTestData;
