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
        try {
          setTestData(JSON.parse(val));
        } catch (err) {} /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
      }}
      value={testData}
    />
  );
};

export default TestDataSection;

