import React from 'react';
import { Box as BoxComponent } from 'hibana';
import { TextField as NewTextField } from 'hibana';
import { TextField as OldTextField } from '@sparkpost/matchbox';
import { useHibana } from 'src/context/Hibana';
import _ from 'lodash';

export function Box(props) {
  const isHibanaEnabled = useHibana();

  if (isHibanaEnabled) {
    return <BoxComponent {...props} />;
  }

  return <>{props.children}</>;
}

// Only a partial list
const blockList = [
  'margin',
  'm',
  'marginTop',
  'mt',
  'marginRight',
  'mr',
  'marginBottom',
  'mb',
  'marginLeft',
  'ml',
  'marginX',
  'mx ',
  'marginY',
  'm',
];

// Demonstrates omitting new component props
export function TextField(props) {
  const isHibanaEnabled = useHibana();

  if (isHibanaEnabled) {
    return <NewTextField {...props} />;
  }

  return <OldTextField {..._.omit(props, blockList)} />;
}
