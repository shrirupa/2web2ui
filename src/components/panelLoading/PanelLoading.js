import React from 'react';
import PropTypes from 'prop-types';
import { Box, Panel } from 'src/components/matchbox';
import { Loading } from 'src/components/loading/Loading';
import styles from './PanelLoading.module.scss';

const PanelLoading = props => {
  const { minHeight, accent } = props;

  return (
    <Panel className={styles.Loading} style={{ minHeight }} accent={accent} data-id="panel-loading">
      <Box minHeight={minHeight}>
        <Loading />
      </Box>
    </Panel>
  );
};

PanelLoading.propTypes = {
  minHeight: PropTypes.string,
  accent: PropTypes.bool,
};

PanelLoading.defaultProps = {
  minHeight: '400px',
  accent: false,
};

export default PanelLoading;
