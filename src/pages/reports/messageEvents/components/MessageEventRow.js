/* eslint-disable max-lines */
import React, { Component } from 'react';
import { snakeToFriendly } from 'src/helpers/string';
import DisplayDate from 'src/components/displayDate/DisplayDate';
import { getDetailsPath } from 'src/helpers/messageEvents';
import _ from 'lodash';
import styles from './MessageEventRow.module.scss';
import { Table } from '@sparkpost/matchbox';
import { withRouter } from 'react-router-dom';

export class MessageEventRow extends Component {
  onClick = () => {
    const url = getDetailsPath(this.props.event.message_id, this.props.event.event_id);
    this.props.history.push(url);
  };

  render() {
    return (
      <Table.Row className={styles.Row} onClick={this.onClick}>
        <Table.Cell className={styles.Cell}>{snakeToFriendly(this.props.event.type)}</Table.Cell>
        <Table.Cell className={styles.Cell}>{this.props.event.subject}</Table.Cell>
        <Table.Cell className={styles.Cell}>{this.props.event.rcpt_to}</Table.Cell>
        <Table.Cell className={styles.Cell}>{this.props.event.friendly_from}</Table.Cell>
        <Table.Cell className={styles.Cell}><DisplayDate timestamp={this.props.event.timestamp} formattedDate={this.props.event.formattedDate} /></Table.Cell>
      </Table.Row>
    );
  }
}

export default withRouter(MessageEventRow);
