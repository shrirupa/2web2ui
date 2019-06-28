import React, { useEffect } from 'react';
import useEditorContext from '../hooks/useEditorContext';
import Editor from './Editor';

const TestDataSection = () => {
  const { setTestData, syncTestDataInStorage, testData } = useEditorContext();

  useEffect(() => //sync with storage during unmount
    syncTestDataInStorage
  , [syncTestDataInStorage]);

  return (
    <Editor
      mode="json"
      name="test-data-editor"
      onChange={(val) => {
        setTestData(val);
      }}
      value={testData}
    />
  );
};

export default TestDataSection;

