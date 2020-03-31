import React from 'react';
import styles from './Card.module.scss';
import classNames from 'classnames';
import { useHibana } from 'src/context/HibanaContext';
import { Box, Text } from 'src/components/matchbox';

export const Card = ({ children, textAlign }) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  if (!isHibanaEnabled)
    return <div className={classNames(styles.CardContainer, styles[textAlign])}>{children}</div>;
  return (
    <Box border="400" padding="400" textAlign={textAlign}>
      {children}
    </Box>
  );
};

export const CardActions = ({ children }) => <>{children}</>;

export const CardContent = ({ children }) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  if (!isHibanaEnabled) return <div className={styles.CardContent}>{children}</div>;

  return (
    <Box display="inline-block" fontSize="500">
      {children}
    </Box>
  );
};

export const CardTitle = ({ children }) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  if (!isHibanaEnabled) return <h2 className={styles.CardTitle}>{children}</h2>;

  return (
    <Text as="h3" mb="100">
      {children}
    </Text>
  );
};
