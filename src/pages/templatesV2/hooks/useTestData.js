import { useEffect, useState } from 'react';

const useTestData = ({ draft = {}, templateTestData, version: mode, getTestDataFromLocalStorage, setTestDataToLocalStorage, isPublishedMode }) => {
  const [state, setState] = useState(templateTestData);
  const [formattedData, setFormattedData] = useState({});

  //on mount, trigger fetching data from store
  useEffect(() => {
    getTestDataFromLocalStorage({ id: draft.id, mode });
  }, [draft.id, getTestDataFromLocalStorage, mode]);

  //update local state when testData is externally updated (e.g. completed loading from store)
  useEffect(() => {
    setState(templateTestData);
    setFormattedData(JSON.parse(templateTestData));
  }, [setState, setFormattedData, templateTestData]);

  //whenever data is changed locally, save it in localstorage.
  useEffect(() => {
    setTestDataToLocalStorage({ id: draft.id, data: state, mode });
  }, [state, draft.id, mode, setTestDataToLocalStorage]);

  return {
    formattedTestData: formattedData,
    testData: state,
    setTestData: setState
  };
};

export default useTestData;
