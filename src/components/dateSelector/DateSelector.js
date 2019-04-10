import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import classnames from 'classnames';
import { ArrowForward, ArrowBack } from '@sparkpost/matchbox-icons';
import styles from './DateSelector.module.scss';

export class Navbar extends Component {
  render() {
    const {
      onPreviousClick,
      onNextClick,
      showNextButton,
      showPreviousButton
    } = this.props;

    return (
      <div className={styles.Navbar}>
        <ArrowBack
          size={21}
          onClick={() => onPreviousClick()}
          className={classnames(styles.Prev, showPreviousButton && styles.show)} />
        <ArrowForward
          size={21}
          onClick={() => onNextClick()}
          className={classnames(styles.Next, showNextButton && styles.show)} />
      </div>
    );
  }
}

const DateSelector = ({ selectedDays, ...props }) => {
  const modifiers = selectedDays
    ? {
      [styles.firstSelected]: (day) => DateUtils.isSameDay(day, selectedDays.from),
      [styles.lastSelected]: (day) => DateUtils.isSameDay(day, selectedDays.to),
      [styles.inBetween]: (day) => DateUtils.isDayBetween(day, selectedDays.from, selectedDays.to)
    }
    : {};

  return (
    <DayPicker
      modifiers={modifiers}
      classNames={styles}
      navbarElement={Navbar}
      {...props}
    />
  );
};

export default DateSelector;
