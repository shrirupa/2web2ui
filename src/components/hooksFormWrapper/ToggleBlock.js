import React from 'react';

import { Grid, Toggle } from '@sparkpost/matchbox';
import styles from './ToggleBlock.module.scss';

const ToggleBlock = ({ name, label, helpText, parse, onChange, ...rest }) => {
  const helpMarkup = helpText
    ? <div className={styles.Help}>{helpText}</div>
    : null;

  return (
    <div className={styles.ToggleBlock}>
      <Grid>
        <Grid.Column xs={8}>
          <label className={styles.Label}>{label}</label>
        </Grid.Column>
        <Grid.Column xs={4}>
          <div className={styles.ToggleWrapper}>
            <Toggle
              name={name}
              id={name}
              onChange={(e) => {
                onChange(e.target.name, parse(e.target.checked));
              }}
              {...rest}
            />
          </div>
        </Grid.Column>
      </Grid>
      {helpMarkup}
    </div>
  );
};

export default ToggleBlock;
