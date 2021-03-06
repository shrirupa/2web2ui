import React from 'react';
import { FileEdit, CheckCircle } from '@sparkpost/matchbox-icons';
import { Prompt } from 'react-router';

import { RedirectAndAlert } from 'src/components/globalAlert';
import FullPage from 'src/components/fullPage';
import Loading from 'src/components/loading';
import EditNavigation from './components/EditNavigation';
import links from './constants/editNavigationLinks';
import useEditorContext from './hooks/useEditorContext';
import styles from './EditAndPreviewPage.module.scss';
import { routeNamespace } from './constants/routes';

const EditAndPreviewPage = () => {
  const {
    currentNavigationIndex,
    draft,
    hasDraftFailedToLoad,
    isDraftLoading,
    isPublishedMode,
    hasSaved,
  } = useEditorContext();
  const Contents = links[currentNavigationIndex].render;
  const PrimaryArea = links[currentNavigationIndex].renderPrimaryArea;

  if (hasDraftFailedToLoad) {
    return (
      <RedirectAndAlert
        to={`/${routeNamespace}`}
        alert={{ type: 'error', message: 'Unable to load template' }}
      />
    );
  }

  if (isDraftLoading) {
    return <Loading />;
  }

  const primaryArea = () => (
    <>
      {isPublishedMode ? (
        <div className={styles.Status} data-id="template-status">
          <span>Published</span>

          <CheckCircle size={17} className={styles.GreenColor} />
        </div>
      ) : (
        <div className={styles.Status} data-id="template-status">
          <span>Draft</span>

          <FileEdit size={17} />
        </div>
      )}
    </>
  );

  const title = draft => {
    if (!isPublishedMode) {
      return `${draft.name} (DRAFT)`;
    }

    return draft.name;
  };

  return (
    <FullPage
      breadcrumbRedirectsTo={`/${routeNamespace}`}
      title={title(draft)}
      primaryArea={primaryArea()}
    >
      <div className={styles.EditorNav}>
        <EditNavigation primaryArea={<PrimaryArea />} />
      </div>

      <div className={styles.MainContent}>
        <Contents />
      </div>

      <Prompt
        when={!hasSaved}
        message={location => {
          if (location.pathname.startsWith(`/${routeNamespace}/edit`)) {
            return true;
          }

          return 'Are you sure you want to leave the page? If you return to the previous page, your work will not be saved.';
        }}
      />
    </FullPage>
  );
};

export default EditAndPreviewPage;
