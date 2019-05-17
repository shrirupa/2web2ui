import React, { useState } from 'react';
import classnames from 'classnames';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { CheckCircleOutline, ErrorOutline, AddCircleOutline } from '@sparkpost/matchbox-icons';
import { HEALTH_SCORE_COMPONENTS } from 'src/pages/signals/constants/info';
import { roundToPlaces } from 'src/helpers/units';
import { formatDate } from 'src/helpers/date';
import _ from 'lodash';

import styles from './Rec.module.scss';

const content = {
  'List Quality': {
    good: 'Your recipient lists look great.',
    bad: 'Your recipient lists could use some improvement.',
    fix: 'Improving list quality can help improve your email deliverability and engagement by reducing spam foldering, delays, and blocked messages.',
    fixLabel: 'Validate Recipient Lists'
  },
  'Hard Bounces': {
    good: 'Hard bounces are not affecting your health score.',
    bad: 'Hard bounces are negatively affecting your health score.',
    fix: 'It’s not unusual for lists to contain some typos or addresses that no longer exist. Clean your list to improve your sending.',
    fixLabel: 'Validate Recipient Lists'
  },
  'Block Bounces': {
    good: 'Block bounces are not affecting your health score.',
    bad: 'Block bounces are negatively affecting your health score.',
    fix: 'Bounces are the result of a low reputation. You may need to contact the postmaster to request mitigation once you make changes to improve your reputation.',
    fixLabel: 'Improve Your Reputation'
  },
  'Complaints': {
    good: 'Your email is not being marked as spam.',
    bad: 'Your email has an unusually high rate of spam complaints.',
    fix: 'Complaints have a strong negative impact on your deliverability. You should take steps to improve your list hygiene and email content.',
    fixLabel: 'Refresh Your Content'
  },
  'Transient Failures': {
    good: 'Transient failures are not affecting your health score.',
    bad: 'Temporary bounces could be affecting your health score.',
    fix: 'These delays in email delivery have varied causes, but may be a sign of low reputation at mailbox providers.',
    fixLabel: 'Improve Your Reputation'
  },
  'Other bounces': {
    good: 'Other bounces are not affecting your health score.',
    bad: 'Your emails are being bounced without a clear reason.',
    fix: 'These bounces have varied causes, but improving your list quality can help resolve many bounce types.',
    fixLabel: 'Validate Recipient Lists'
  },
  'eng cohorts: new, 14-day': {
    good: 'Your recipients are engaging.',
    bad: 'Not enough of your recipients have recently engaged with your email.',
    link: 'https://www.sparkpost.com/docs/signals/engagement/',
    fix: 'Low engagement may be hurting your email deliverability. Make sure to only send relevant and desired messages.',
    fixLabel: 'Improve Your Practices'
  },
  'eng cohorts: unengaged': {
    good: 'You are not sending to many unengaged recipients.',
    bad: 'Too many of your recipients have been inactive for 365 days.',
    fix: 'Low engagement may be hurting your email deliverability. You should try to sending to only engaged recipients.',
    fixLabel: 'Download Unengaged Recipients'
  }
};

export function Recommendations(props) {
  const { weights = []} = props;

  const actions = weights.reduce((acc, { weight, weight_type, ...rest }) => {
    const parsedWeight = parseFloat(weight);

    acc.push({
      value: rest.weight_value,
      title: HEALTH_SCORE_COMPONENTS[weight_type].label,
      weight: parsedWeight,
      type: parsedWeight < 0 && content[weight_type] ? 'bad' : 'good',
      ...content[weight_type]
    });

    return acc;
  }, []);

  const sorted = _.orderBy(actions, 'weight', 'asc');
  return (
    <Grid className={styles.Grid}>
      {_.map(sorted, (rec) => (
        <Grid.Column xs={12} md={6} lg={4} xl={3} key={rec.title}>
          <Recommendation {...rec}/>
        </Grid.Column>
      ))}
    </Grid>
  );
}

export function Recommendation(props) {
  const { title, type, value, good, bad, fix, fixLabel } = props;
  const [open, setOpen] = useState(false);

  return (
    <Panel className={styles.Panel} sectioned>
      {open && <a className={styles.Clear} onClick={() => setOpen(false)}><AddCircleOutline size={27} /></a>}
      <h6 className={styles.Title}>
        {title}
        {!open && (
          type === 'bad' ? <ErrorOutline className={styles.BadIcon} size={27} /> : <CheckCircleOutline className={styles.GoodIcon} size={27} />
        )}
      </h6>
      <div className={styles.Content}>
        <div className={styles.Value}>{roundToPlaces(value * 100, 3)}%</div>
        <p className={styles.Desc}>{type === 'bad' ? bad : good}</p>
      </div>

        {type === 'bad' && (
          <div className={styles.ActionSection}>
            <Button onClick={() => setOpen(true)} size='small' outline fullWidth>Fix Now</Button>
          </div>
        )}

      <div className={classnames(styles.Reveal, open && styles.open)}>
        <div className={styles.RevealContent}>
          <p className={styles.Fix}>{fix}</p>
          <Button size='small' outline fullWidth className={styles.FixButton}>{fixLabel}</Button>
        </div>
      </div>
    </Panel>
  );
}

export function SectionTitle({ date }) {
  return (
    <h2 className={styles.SectionTitle}>Recommendations <span>{formatDate(date)}</span></h2>
  );
}
