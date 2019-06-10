import React from 'react';
import { connect } from 'react-redux';
import { getDraft, getPreview, getPublished, update, deleteTemplate } from 'src/actions/templates';
import { list as listDomains } from 'src/actions/sendingDomains';
import { list as listSubaccounts } from 'src/actions/subaccounts';

import {
  selectDraftTemplate,
  selectDraftTemplatePreview,
  selectPreviewLineErrors,
  selectPublishedTemplate
} from 'src/selectors/templates';
import { EditorContextProvider } from './context/EditorContext';
import EditAndPreviewPage from './EditAndPreviewPage';
import { selectDomainsBySubaccount } from '../../selectors/templates';

const EditAndPreviewPageContainer = (props) => (
  <EditorContextProvider value={props}>
    <EditAndPreviewPage />
  </EditorContextProvider>
);

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const draft = selectDraftTemplate(state, id);
  const published = selectPublishedTemplate(state, id);

  return {
    draft,
    published,
    hasDraftFailedToLoad: Boolean(state.templates.getDraftError),
    hasFailedToPreview: Boolean(state.templates.contentPreview.error),
    isDraftLoading: !draft || Boolean(state.templates.getDraftLoading),
    isDeletePending: state.templates.deletePending,
    isDraftUpdating: Boolean(state.templates.updating),
    preview: selectDraftTemplatePreview(state, id, {}),
    previewLineErrors: selectPreviewLineErrors(state),
    domains: selectDomainsBySubaccount(state, props),
    domainsLoading: state.sendingDomains.listLoading
  };
};

const mapDispatchToProps = {
  getDraft,
  getPreview,
  getPublished,
  deleteTemplate,
  updateDraft: update,
  listDomains,
  listSubaccounts
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAndPreviewPageContainer);
