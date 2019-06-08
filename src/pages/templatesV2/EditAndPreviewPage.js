import React from 'react';
import { RedirectAndAlert } from 'src/components/globalAlert';
import FullPage from 'src/components/fullPage';
import Loading from 'src/components/loading';
import EditNavigation from './components/EditNavigation';
import links from './constants/editNavigationLinks';
import useEditorContext from './hooks/useEditorContext';

import { routeNamespace } from './constants/routes';
import styles from './EditAndPreview.module.scss';

const EditAndPreviewPage = () => {
  const { currentNavigationIndex, draft, hasDraftFailedToLoad, isDraftLoading } = useEditorContext();
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

  return (
    <FullPage
      breadcrumbRedirectsTo={`/${routeNamespace}`}
      title={draft.name}
    >
      <div className={styles.EditorNav}>
        <EditNavigation primaryArea={<PrimaryArea/>}/>
      </div>

      <div className={styles.MainContent}>
        <Contents/>
      </div>
    </FullPage>
  );
};

export default EditAndPreviewPage;
