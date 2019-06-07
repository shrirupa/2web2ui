import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Panel, Grid, TextField } from '@sparkpost/matchbox';
import DatePicker from 'src/components/datePicker/DatePicker';
import { FORMATS, RELATIVE_DATE_OPTIONS } from 'src/constants';
import FilterDropdown from './FilterDropdown';
import useDatePicker from '../hooks/useDatePicker';
import useFieldValueOnReturn from '../hooks/useFieldValueOnReturn';

const retentionPeriodDays = 365;

const SUCCESS_VALUE = 'success';
const batchStatusOptions = [
  { label: 'Success', value: SUCCESS_VALUE },
  { label: 'Validation', value: 'validation' },
  { label: 'System', value: 'system' },
  { label: 'Decompression', value: 'decompress' },
  { label: 'Duplicates', value: 'duplicate_batch' },
  { label: 'Empty batches', value: 'empty_batch' }
];

const toBatchStatus = ({ errorTypes, showSuccessful }) => {
  const batchStatusItems = errorTypes ? errorTypes : [];
  return showSuccessful ? [...batchStatusItems, SUCCESS_VALUE] : batchStatusItems;
};

const fromBatchStatus = (batchStatus) => ({
  showSuccessful: batchStatus.indexOf(SUCCESS_VALUE) >= 0,
  errorTypes: batchStatus.filter((status) => status !== SUCCESS_VALUE)
});

const minimalDateRange = ({ relativeRange, ...rest }) => {
  if (relativeRange === 'custom') {
    return { relativeRange, ...rest };
  }
  return { relativeRange };
};

const BatchStatusSearch = ({ now, disabled, filters: initialFilters, onFilterChange }) => {
  const initialBatchStatus = toBatchStatus(initialFilters);
  const initialBatchIds = initialFilters.batchIds;
  const { dateRange, setDateRange } = useDatePicker(initialFilters, { now });
  const [batchIds, setBatchIds] = useState(initialBatchIds);
  const [batchStatus, setBatchStatus] = useState(initialBatchStatus);
  const batchIdProps = useFieldValueOnReturn(batchIds, setBatchIds);

  useEffect(
    () => {
      const { showSuccessful, errorTypes } = fromBatchStatus(batchStatus);
      onFilterChange({ errorTypes, showSuccessful, batchIds, ...minimalDateRange(dateRange) });
    },
    [dateRange, batchStatus, batchIds] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Panel>
      <Panel.Section>
        <Grid>
          <Grid.Column xs={12} md={6} xl={5}>
            <DatePicker
              {...dateRange}
              disabled={disabled}
              onChange={setDateRange}
              dateFieldFormat={FORMATS.DATETIME}
              relativeDateOptions={RELATIVE_DATE_OPTIONS}
              roundToPrecision={false}
              datePickerProps={{
                disabledDays: {
                  after: now,
                  before: moment(now)
                    .subtract(retentionPeriodDays, 'days')
                    .toDate()
                }
              }}
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6} xl={4}>
            <TextField
              labelHidden
              placeholder="Filter by batch ID"
              value={batchIds}
              {...batchIdProps}
              disabled={disabled}
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6} xl={3}>
            <FilterDropdown
              label="Batch Status"
              options={batchStatusOptions}
              initialSelected={batchStatus}
              onChange={setBatchStatus}
              disabled={disabled}
            />
          </Grid.Column>
        </Grid>
      </Panel.Section>
    </Panel>
  );
};

BatchStatusSearch.batchStatusOptions = batchStatusOptions;

export default BatchStatusSearch;
