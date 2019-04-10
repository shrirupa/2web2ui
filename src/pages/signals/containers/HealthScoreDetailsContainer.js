import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getHealthScore, getSpamHits } from 'src/actions/signals';
import { selectHealthScoreDetails, getSelectedDateFromRouter } from 'src/selectors/signals';
import { getDateTicks } from 'src/helpers/date';
import { getDisplayName } from 'src/helpers/hoc';
import _ from 'lodash';

export class WithHealthScoreDetails extends Component {
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    const { filters } = this.props;

    // Refresh when filters change
    if (!_.isEqual(prevProps.filters, filters)) {
      this.getData();
    }
  }

  getData = () => {
    const { getHealthScore, getSpamHits, facet, facetId, filters, subaccountId } = this.props;
    const options = {
      facet,
      filter: facetId,
      from: filters.from,
      relativeRange: filters.relativeRange,
      subaccount: subaccountId,
      to: filters.to
    };
    getHealthScore(options);
    getSpamHits(options);
  }

  render() {
    const {
      component: WrappedComponent,
      details,
      facet,
      facetId,
      filters,
      selected,
      subaccountId
    } = this.props;

    // Calculate gap here to share with preview and details
    const gap = details.data && details.data.length > 15 ? 0.2 : 1;

    return (
      <WrappedComponent {...details} facet={facet} facetId={facetId} gap={gap} selected={selected} xTicks={getDateTicks(filters)} subaccountId={subaccountId} />
    );
  }
}

/**
 * Provides Spam Trap details to the provided component
 * @example
 *   export default withHealthScoreDetails(MyComponent);
 */
function withHealthScoreDetails(WrappedComponent) {
  const Wrapper = (props) => (
    <WithHealthScoreDetails {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = getDisplayName(WrappedComponent, 'WithHealthScoreDetails');

  const mapStateToProps = (state, props) => ({
    ...selectHealthScoreDetails(state, props),
    filters: state.signalOptions,
    selected: getSelectedDateFromRouter(state, props)
  });

  return withRouter(connect(mapStateToProps, { getHealthScore, getSpamHits })(Wrapper));
}

export default withHealthScoreDetails;
