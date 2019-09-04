import React from 'react';
import { Warning, CheckCircle } from '@sparkpost/matchbox-icons';
import { Tag } from '@sparkpost/matchbox';
import styles from './statusTags.module.scss';

const friendlyErrorTypeMap = {
  validation: 'Validation error',
  system: 'System error',
  decompress: 'Decompression error',
  duplicate_batch: 'Duplicate batch',
  empty_batch: 'Empty batch'
};
const Status = ({ status, error }) => {
  const isError = status !== 'success';
  const icon = isError ? <Warning color="#fa6423" /> : <CheckCircle color="#9bcd5a" />;
  const msg = isError ? friendlyErrorTypeMap[error] : 'Success';
  return (
    <Tag className={styles.StatusTag}>
      {icon} {msg}
    </Tag>
  );
};

export default Status;
