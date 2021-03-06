import React from 'react';
import classNames from 'classnames';
import useEditorContext from '../hooks/useEditorContext';
import styles from './PreviewContainer.module.scss';

const PreviewContainer = ({ children }) => {
  const { previewDevice } = useEditorContext();

  if (previewDevice === 'mobile') {
    return (
      <div
        className={classNames(styles.PreviewMobileContainer, 'notranslate')}
        data-id="preview-mobile-phone"
      >
        <div className={styles.PreviewMobilePhone}>
          <div className={styles.PreviewMobilePhoneScreen}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PreviewContainer} data-id="preview-desktop">
      <div className={classNames(styles.PreviewScreen, 'notranslate')}>{children}</div>
    </div>
  );
};

export default PreviewContainer;
