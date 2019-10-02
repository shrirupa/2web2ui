import React from 'react';
import { Button, Popover } from '@sparkpost/matchbox';
import { ArrowDropDown, FileEdit } from '@sparkpost/matchbox-icons';
import PageLink from 'src/components/pageLink';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { routeNamespace } from '../../constants/routes';
import styles from './Actions.module.scss';
import useEditorContext from '../../hooks/useEditorContext';

const PublishedModeActions = () => {
  const { hasDraft, draft } = useEditorContext();
  const draftText = hasDraft ? 'Edit Draft' : 'Save as Draft';
  const editDraftTo = `/${routeNamespace}/edit/${draft.id}/draft/content${setSubaccountQuery(draft.subaccount_id)}`;

  return (
    <Button.Group>
      <Button to={editDraftTo} className={styles.Actions}>
        <strong>{draftText}</strong>
      </Button>

      <div className={styles.Actions}>
        <Popover
          left={true}
          trigger={<Button><ArrowDropDown/></Button>}
        >
          <div className={styles.ActionsBody}>
            <div className={styles.ActionItem}>
              <PageLink to={editDraftTo}>
                <FileEdit/>

                {draftText}
              </PageLink>
            </div>
          </div>
        </Popover>
      </div>
    </Button.Group>
  );
};
PublishedModeActions.displayName = 'PublishedModeActions';
export default PublishedModeActions;
