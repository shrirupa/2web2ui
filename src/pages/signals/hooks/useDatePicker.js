import { useState } from 'react';
import { getRelativeDates } from 'src/helpers/date';
import moment from 'moment';

const parseDate = (date) => {
  if (date instanceof Date) {
    return date;
  }
  return moment(date).toDate();
};

const toDateRange = ({ relativeRange, from, to }, { now }) =>
  relativeRange === 'custom'
    ? { relativeRange, from: parseDate(from), to: parseDate(to) }
    : getRelativeDates(relativeRange, { now });

const useDatePicker = (initialDateRange, { now = null }) => {
  const [dateRange, setDateRange] = useState(toDateRange(initialDateRange, { now }));

  const updateDateRange = ({ relativeRange, from, to }) => {
    const fullDateRange = toDateRange({ relativeRange, from, to }, { now });
    setDateRange(fullDateRange);
  };
  return { key: initialDateRange, dateRange, setDateRange: updateDateRange };
};

export default useDatePicker;
