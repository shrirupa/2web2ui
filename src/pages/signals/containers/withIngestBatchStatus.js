import { connect } from 'react-redux';

import {
  signalsBatchStatusReset,
  signalsBatchStatusNextPage,
  signalsBatchStatusPrevPage
} from 'src/actions/signalsBatchStatus';

const mapStateToProps = ({
  signalsBatchStatus: { loading, error, items, page, totalCount, hasMore }
}) => ({
  loading,
  error,
  items,
  page,
  totalCount,
  hasMore
});

const mapDispatchToProps = {
  signalsBatchStatusReset,
  signalsBatchStatusNextPage,
  signalsBatchStatusPrevPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
