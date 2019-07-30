import React from 'react';
import { Button, Grid, Panel, Tag } from '@sparkpost/matchbox';
import { METRICS, FILTERS_FRIENDLY_NAMES, SOURCE_FRIENDLY_NAMES, OPERATOR_FRIENDLY_NAMES } from '../constants/formConstants';
import { MAILBOX_PROVIDERS } from 'src/constants';
import styles from './AlertDetails.module.scss';
import AlertToggle from './AlertToggleNew';
import { EmailIcon, SlackIcon, WebhookIcon } from 'src/components/icons';
import { Link } from 'react-router-dom';

const extraChannels = [
  {
    key: 'slack',
    icon: SlackIcon,
    label: 'Slack'
  },
  {
    key: 'webhook',
    icon: WebhookIcon,
    label: 'Webhook'
  }
];

export const AlertDetails = ({ alert, id, subaccountIdToString }) => {
  const { metric, channels = {}, filters = [], subaccounts = [], threshold_evaluator = {}, any_subaccount, muted } = alert;
  const { source, operator, value } = threshold_evaluator;

  const getSubaccountsTags = () => {
    if (any_subaccount) {
      return (
        <Tag className={styles.Tags}>Any Subaccount</Tag>
      );
    }
    const subaccountTags = subaccounts.map((subaccount) =>
      <Tag className={styles.Tags} key={subaccount}>{subaccountIdToString(subaccount)}</Tag>
    );
    return subaccountTags;
  };

  const getFilterValuesTags = (type, values) => {
    const valueTags = values.map((value) => {
      const formattedValue = (type === 'mailbox_provider') ? MAILBOX_PROVIDERS[value] : value;
      return (<Tag className={styles.Tags} key={`${type}-${value}`}>{formattedValue}</Tag>);
    });
    return valueTags;
  };

  const renderFilteredBy = () => {
    const subaccount = (
      <span key={'subaccounts'}>
        Subaccounts: {getSubaccountsTags()}
      </span>
    );
    const filtersTags = filters.map((filter) => (
      <span key={filter.filter_type}>
        and {FILTERS_FRIENDLY_NAMES[filter.filter_type]}: {getFilterValuesTags(filter.filter_type, filter.filter_values)}
      </span>
    ));
    return [subaccount, ...filtersTags];
  };

  const renderEvaluated = () => {
    const sourceTag = <Tag className={styles.Tags}>{SOURCE_FRIENDLY_NAMES[source]}</Tag>;
    const operatorText = (source === 'raw') ? OPERATOR_FRIENDLY_NAMES[operator].toLowerCase() : `change ${OPERATOR_FRIENDLY_NAMES[operator].toLowerCase()}`;
    const suffix = (source === 'raw') ? '' : '%';
    const valueTag = <Tag className={styles.Tags}>{value}{suffix}</Tag>;
    return (<>
      {sourceTag}
      {operatorText}
      {valueTag}
      </>);
  };

  const renderNotify = () => {
    const { emails, ...restChannels } = channels;
    const visibleExtraChannels = extraChannels.filter(({ key }) => restChannels.hasOwnProperty(key));

    return (
      <>
        {emails && emails.length > 0 && (
          <div key="email">
            Email: {emails.map((email) => (
              <Tag key={email} className={styles.TagsWithIcon}>
                <EmailIcon className={styles.Icon}/>
                <span className={styles.TagText}>{email}</span>
              </Tag>
            ))}
          </div>
        )}
        {visibleExtraChannels.map(({ icon: Icon, key, label }) => (
          <div key={key}>
            {label}: <Tag className={styles.TagsWithIcon}>
              <Icon className={styles.Icon}/>
              <span className={styles.TagText}>{restChannels[key].target}</span>
            </Tag>
          </div>
        ))}
      </>
    );
  };

  const detailsMap = [
    { name: 'Alert Metric: ', render: (() => (<span className={styles.AlertName}>{METRICS[metric]}</span>)) },
    { name: 'Filtered By: ', render: (() => (renderFilteredBy())) },
    { name: 'Evaluated:', render: (() => (renderEvaluated())) },
    { name: 'Notify:', render: (() => (renderNotify())) },
    { name: 'Status:', render: (() => (<AlertToggle muted={muted} id={id} />)) }
  ];

  const renderAlertDetails = () =>
    detailsMap.map(({ name, render }, i) => (
      <Panel.Section key={i} className={styles.Panel}>
        <Grid>
          <Grid.Column xs={12} md={2}>
            {name}
          </Grid.Column>
          <Grid.Column xs={12} md={10}>
            {render()}
          </Grid.Column>
        </Grid>
      </Panel.Section>
    ));

  return (
    <Panel>
      <Panel.Section className={styles.Panel}>
        <span className={styles.Subtitle}>Alert Details</span>
        <span className={styles.ButtonGroup}>
          <Button component={Link} to={`/alerts-new/edit/${id}`} className={styles.Button} primary>Edit</Button>
        </span>
      </Panel.Section>
      {renderAlertDetails()}
    </Panel>
  );
};