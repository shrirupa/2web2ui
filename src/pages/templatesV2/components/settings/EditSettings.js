import React from 'react';
import { Grid } from '@sparkpost/matchbox';
import SettingsSection from './SettingsSection';
import PreviewSection from '../PreviewSection';
import styles from './EditSettings.module.scss';

const TemplateSettings = () => (
  <Grid className={styles.EditSettings}>
    <Grid.Column sm={12} md={12} lg={6}>
      <SettingsSection/>
    </Grid.Column>
    <Grid.Column sm={12} md={12} lg={6}>
      <PreviewSection/>
    </Grid.Column>
  </Grid>
);

export default TemplateSettings;
