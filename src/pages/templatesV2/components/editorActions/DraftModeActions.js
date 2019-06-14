import React from 'react';
import { Button, Popover } from '@sparkpost/matchbox';
import { ArrowDropDown } from '@sparkpost/matchbox-icons';
// import Duplicate from './Duplicate';
import SaveAndPublish from './SaveAndPublish';
import ViewPublished from './ViewPublished';
import SaveDraft from './SaveDraft';
import styles from './Actions.module.scss';

const DraftModeActions = () => (
  <div>
    <SaveAndPublish className={styles.Actions}>
      <Button><strong>Save and Publish</strong></Button>
    </SaveAndPublish>
    <div className={styles.Actions}>
      <Popover
        left={true}
        trigger={<Button><ArrowDropDown/></Button>}
      >
        <div>
          <SaveAndPublish className={styles.ActionItem}/>
          <SaveDraft className={styles.ActionItem}/>
          <hr className={styles.Divider}/>
          <ViewPublished className={styles.ActionItem}/>
          {/*<Duplicate className={styles.ActionItem}/>*/}
        </div>

      </Popover>
    </div>
  </div>
);

export default DraftModeActions;
