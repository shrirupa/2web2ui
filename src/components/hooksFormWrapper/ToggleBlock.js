import React from 'react';
import _ from 'lodash';

import { Grid, Toggle } from '@sparkpost/matchbox';
import styles from './ToggleBlock.module.scss';

const ToggleBlock = ({ name, label, helpText, parse, onChange = _.noop, formHook, validate, ...rest }) => {
  const helpMarkup = helpText
    ? <div className={styles.Help}>{helpText}</div>
    : null;


  const { useInput } = formHook;
  const { isFocused, isTouched, validateField, isValid, ...inputHooks } = useInput(name, validate);

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
              checked={!!inputHooks.value}
              onChange={(e) => {
                onChange(e.target.name, parse(e.target.checked));
              }}
              {...inputHooks}
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
