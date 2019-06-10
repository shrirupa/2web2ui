import React, { createContext, useEffect } from 'react';
import useRouter from 'src/hooks/useRouter';
import useEditorContent from '../hooks/useEditorContent';
import useEditorNavigation from '../hooks/useEditorNavigation';
import useEditorPreview from '../hooks/useEditorPreview';
import useEditorTabs from '../hooks/useEditorTabs';
import useTemplateSettings from '../hooks/useTemplateSettings';
import useDispatch from 'src/hooks/useDispatch';
import { showAlert } from 'src/actions/globalAlert';

const EditorContext = createContext();

const chainHooks = (...hooks) => (
  hooks.reduce((acc, hook) => ({ ...acc, ...hook(acc) }), {})
);

export const EditorContextProvider = ({ children, value: { getDraft, getPublished, listDomains, listSubaccounts, ...value }}) => {
  const { requestParams } = useRouter();
  const pageValue = chainHooks(
    () => value,
    useEditorContent,
    useEditorNavigation,
    useEditorPreview,
    useEditorTabs,
    useTemplateSettings
  );

  pageValue.showAlert = useDispatch(showAlert);

  useEffect(() => {
    getDraft(requestParams.id, requestParams.subaccount);
    getPublished(requestParams.id, requestParams.subaccount);
    listDomains();
    listSubaccounts();
  }, [listSubaccounts, listDomains, getDraft, getPublished, requestParams.id, requestParams.subaccount]);

  return (
    <EditorContext.Provider value={pageValue}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
