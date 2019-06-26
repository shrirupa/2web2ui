import React from 'react';
import { connect } from 'react-redux';
import {
  deleteTemplate,
  getDraft,
  getPreview,
  getPublished,
  getTestData,
  publish as publishDraft,
  setTestData,
  update as updateDraft
} from 'src/actions/templates';
import { list as listDomains } from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';

import {
  selectDraftTemplate,
  selectDraftTemplatePreview,
  selectPreviewLineErrors,
  selectPublishedTemplate,
  selectTemplateTestData
} from 'src/selectors/templates';
import { EditorContextProvider } from './context/EditorContext';
import EditAndPreviewPage from './EditAndPreviewPage';

const EditAndPreviewPageContainer = (props) => (
  <EditorContextProvider value={props}>
    <EditAndPreviewPage/>
  </EditorContextProvider>
);

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const draft = selectDraftTemplate(state, id);
  const published = selectPublishedTemplate(state, id);
  const isPublishedMode = props.match.params.version === 'published';
  const draftOrPublished = draft || published;
  const hasDraft = draftOrPublished && draftOrPublished.has_draft;
  const hasPublished = draftOrPublished && draftOrPublished.has_published;

  return {
    draft,
    published,
    isPublishedMode,
    hasDraft,
    hasPublished,
    hasDraftFailedToLoad: Boolean(state.templates.getDraftError),
    hasFailedToPreview: Boolean(state.templates.contentPreview.error),
    isDraftLoading: !draft || Boolean(state.templates.getDraftLoading),
    isDeletePending: state.templates.deletePending,
    isDraftUpdating: Boolean(state.templates.updating),
    isDraftPublishing: Boolean(state.templates.publishPending),
    preview: selectDraftTemplatePreview(state, id, {}),
    previewLineErrors: selectPreviewLineErrors(state),
    templateTestData: selectTemplateTestData(state)
  };
};

const mapDispatchToProps = {
  getDraft,
  getPreview,
  getPublished,
  deleteTemplate,
  updateDraft,
  publishDraft,
  listDomains,
  listSubaccounts,
  getTestDataFromLocalStorage: getTestData,
  setTestDataToLocalStorage: setTestData
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAndPreviewPageContainer);
