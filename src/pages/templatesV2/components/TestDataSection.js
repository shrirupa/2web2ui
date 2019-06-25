import React, { useEffect, useState } from 'react';
import useEditorContext from '../hooks/useEditorContext';
import Editor from './Editor';

const TestDataSection = () => {
  const { draft, isPublishedMode, testData, getTestData, setTestData } = useEditorContext();
  const mode = isPublishedMode ? 'published' : 'draft';

  const [data, setData] = useState('');

  //on mount, trigger fetching data from store
  useEffect(() => {
    getTestData({ id: draft.id, mode });
  }, [draft.id, getTestData, mode]);


  //Hydrate when testData is updated (completed loading from store)
  useEffect(() => {
    setData(testData);
  }, [testData]);


  //whenever data is changed locally, save it in store.
  useEffect(() => {
    setTestData({ id: draft.id, data: data, mode });
  }, [data, draft.id, mode, setTestData]);

  return (
    <Editor
      mode="json"
      name="test-data-editor"
      onChange={(val) => {
        setData(val);
      }}
      value={data}
    />
  );

};

export default TestDataSection;

