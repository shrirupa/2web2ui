import React from 'react';
import { CheckCircleOutline, ErrorOutline } from '@sparkpost/matchbox-icons';

const thresholds = {
  danger: {
    color: '#FF594D',
    icon: ErrorOutline,
    condition: (n) => n < 55,
    description: <>A Health score below 55 is considered to be <strong>bad</strong>.</>
  },
  warning: {
    color: '#e6b400',
    icon: ErrorOutline,
    condition: (n) => n < 80 && n >= 55,
    description: <>A Health score below 80 <strong>needs improvement</strong>.</>
  },
  good: {
    color: '#2CC995',
    icon: CheckCircleOutline,
    condition: (n) => n >= 80,
    description: <>A Health score above 80 is considered to be <strong>very good</strong>.</>
  }
};

export default thresholds;