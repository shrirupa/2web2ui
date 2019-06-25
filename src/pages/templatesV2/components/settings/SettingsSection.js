import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import SettingsForm from './Form.Container';
import styles from './SettingsSection.module.scss';

const SettingsSection = () => (
  <Panel className={styles.SettingsSection}>
    <Panel.Section className={styles.SettingsHeader}>
      <h2>Template Settings</h2>
    </Panel.Section>
    <SettingsForm/>
  </Panel>
);

SettingsSection.displayName = 'SettingsSection';
export default SettingsSection;