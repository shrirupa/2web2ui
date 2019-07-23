import React from 'react';
import { Grid } from '@sparkpost/matchbox';
import styles from './InfoBlock.module.scss';

const InfoBlock = ({ label, value, columnProps = {}}) => <Grid.Column {...columnProps}>
  <span className={styles.InfoLabel}>{label}:</span>
  <br/>
  <span className={styles.InfoValue}>{value}</span>
</Grid.Column>;

export default InfoBlock;