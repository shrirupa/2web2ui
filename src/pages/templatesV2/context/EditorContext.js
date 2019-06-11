import React, { createContext, useEffect } from 'react';
import useRouter from 'src/hooks/useRouter';
import useEditorContent from '../hooks/useEditorContent';
import useEditorNavigation from '../hooks/useEditorNavigation';
import useEditorPreview from '../hooks/useEditorPreview';
import useEditorTabs from '../hooks/useEditorTabs';

const EditorContext = createContext();

const chainHooks = (...hooks) => (
  hooks.reduce((acc, hook) => ({ ...acc, ...hook(acc) }), {})
);

export const EditorContextProvider = ({
  children,
  value: { getDraft, getPublished, ...value }
}) => {
  const { requestParams } = useRouter();
  const pageValue = chainHooks(
    () => value,
    useEditorContent,
    useEditorNavigation,
    useEditorPreview,
    useEditorTabs
  );

  useEffect(() => {
    getDraft(requestParams.id, requestParams.subaccount);
    getPublished(requestParams.id, requestParams.subaccount);
  }, [getDraft, getPublished, requestParams.id, requestParams.subaccount]);

  return (
    <EditorContext.Provider value={pageValue}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;