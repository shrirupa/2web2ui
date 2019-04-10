import React, { useState, useEffect } from 'react';
import { FORMATS } from 'src/constants';
import { getRelativeDates, getStartOfDay } from 'src/helpers/date';
import DatePicker from 'src/components/datePicker/DatePicker';
import withSignalOptions from '../../containers/withSignalOptions';
import { minDays } from 'src/helpers/validation';
import moment from 'moment';

const OPTIONS = [
  '7days',
  '14days',
  '30days',
  '90days',
  'custom'
];

export function DateFilter({ signalOptions, changeSignalOptions, left, now = new Date() }) {
  // Start of day is used to prevent unwanted side effects when now changes
  const relativeNow = getStartOfDay(moment(now).subtract(1, 'day')).toString();
  const [dates, setDates] = useState({ to: null, from: null });
  const { relativeRange, from, to } = signalOptions;

  // Creates dates for the datepicker from signal options
  useEffect(() => {
    let updates = { from, to };

    if (relativeRange !== 'custom') {
      updates = getRelativeDates(relativeRange, { now: new Date(relativeNow) });
    }

    setDates(updates);
  }, [relativeRange, from, to, relativeNow]);

  function handleChange(updates) {
    changeSignalOptions(updates);
  }

  return (
    <DatePicker
      now={moment(now).subtract(1, 'day').toDate()}
      from={dates.from}
      to={dates.to}
      relativeDateOptions={OPTIONS}
      relativeRange={signalOptions.relativeRange}
      onChange={handleChange}
      dateFieldFormat={FORMATS.DATE}
      datePickerProps={{
        disabledDays: {
          after: moment(now).subtract(1, 'day').toDate(),
          before: moment(now).subtract(91, 'day').toDate()
        },
        fromMonth: moment(now).subtract(91, 'day').toDate()
      }}
      roundToPrecision={false}
      hideManualEntry
      left={left}
      validate={minDays(7)}
    />
  );
}

export default withSignalOptions(DateFilter);
