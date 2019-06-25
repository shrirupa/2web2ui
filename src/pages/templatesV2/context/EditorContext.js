import React, { createContext, useEffect } from 'react';
import useRouter from 'src/hooks/useRouter';
import useEditorAnnotations from '../hooks/useEditorAnnotations';
import useEditorContent from '../hooks/useEditorContent';
import useEditorNavigation from '../hooks/useEditorNavigation';
import useEditorPreview from '../hooks/useEditorPreview';
import useEditorTabs from '../hooks/useEditorTabs';
import useTestData from '../hooks/useTestData';

const EditorContext = createContext();

const chainHooks = (...hooks) => (
  hooks.reduce((acc, hook) => ({ ...acc, ...hook(acc) }), {})
);

export const EditorContextProvider = ({ children, value: { getDraft, getPublished, listDomains, listSubaccounts, ...value }}) => {
  const { requestParams } = useRouter();
  const pageValue = chainHooks(
    () => value,
    useEditorContent,
    useTestData, //must come before Preview
    useEditorNavigation,
    useEditorPreview, // must follow useEditorContent
    useEditorAnnotations, // must follow useEditorContent
    useEditorTabs
  );

  useEffect(() => {
    getDraft(requestParams.id, requestParams.subaccount);
    getPublished(requestParams.id, requestParams.subaccount);
    listDomains();
    listSubaccounts();
  }, [listSubaccounts, listDomains, getDraft, getPublished, requestParams.id, requestParams.version, requestParams.subaccount]);

  return (
    <EditorContext.Provider value={pageValue}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
