import { useEffect, useMemo, useState } from 'react';

const useTestData = ({ draft = {}, testData, getTestData, setTestData, isPublishedMode }) => {
  const [subData, setSubData] = useState(testData);
  const mode = isPublishedMode ? 'published' : 'draft';

  const syncTestData = (data) => {
    setSubData(data);
  };

  const formatSubData = useMemo(() => {
    try {
      return JSON.parse(subData, null, 2);
    } catch (err) {
      // console.warn(err);
      return {};
    }
  }, [subData]);

  //on mount, trigger fetching data from store
  useEffect(() => {
    getTestData({ id: draft.id, mode });
  }, [draft.id, getTestData, mode]);

  //update local state when testData is externally updated (e.g. completed loading from store)
  useEffect(() => {
    syncTestData(testData);
  }, [syncTestData, testData]);

  //whenever data is changed locally, save it in localstorage.
  useEffect(() => {
    setTestData({ id: draft.id, data: subData, mode });
  }, [subData, draft.id, mode, setTestData]);

  return {
    formattedTestData: formatSubData,
    stringTestData: subData,
    syncTestData
  };
};

export default useTestData;
