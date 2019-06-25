import React from 'react';
import useEditorContext from '../hooks/useEditorContext';
import Editor from './Editor';

const TestDataSection = () => {
  const { syncTestData, stringTestData } = useEditorContext();

  return (
    <Editor
      mode="json"
      name="test-data-editor"
      onChange={(val) => {
        syncTestData(val);
      }}
      value={stringTestData}
    />
  );
};

export default TestDataSection;

