import React, { useState } from 'react';
import { Button, Popover } from '@sparkpost/matchbox';
import { ArrowDropDown } from '@sparkpost/matchbox-icons';
import SaveAndPublish from './SaveAndPublish';
import ViewPublished from './ViewPublished';
import SaveDraft from './SaveDraft';
import styles from './Actions.module.scss';
import useEditorContext from '../../hooks/useEditorContext';

export default () => {
  const { hasPublished } = useEditorContext();
  const [open, setOpen] = useState(false);

  return (<Button.Group>
    <SaveAndPublish className={styles.Actions}>
      <Button><strong>Save and Publish</strong></Button>
    </SaveAndPublish>
    <div className={styles.Actions}>
      <Popover
        left={true}
        open={open}
        onClose={() => setOpen(false)}
        trigger={<Button onClick={() => setOpen(true)}><ArrowDropDown/></Button>}
      >
        <div className={styles.ActionsBody}>
          <SaveAndPublish className={styles.ActionItem} onClick={() => setOpen(false)}/>
          <SaveDraft className={styles.ActionItem} onClick={() => setOpen(false)}/>
          {hasPublished &&
            <>
              <hr className={styles.Divider}/>
              <ViewPublished className={styles.ActionItem}/>
            </>
          }
        </div>
      </Popover>
    </div>
  </Button.Group>
  );
};
