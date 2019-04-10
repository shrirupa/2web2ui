import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals';
import { selectSpamHitsDetails, getSelectedDateFromRouter } from 'src/selectors/signals';
import { getDateTicks } from 'src/helpers/date';
import _ from 'lodash';

export class WithSpamTrapDetails extends Component {
  componentDidMount() {
    const { getSpamHits, facet, facetId, filters, subaccountId } = this.props;
    getSpamHits({
      facet,
      filter: facetId,
      from: filters.from,
      relativeRange: filters.relativeRange,
      subaccount: subaccountId,
      to: filters.to
    });
  }

  componentDidUpdate(prevProps) {
    const { getSpamHits, facet, facetId, filters, subaccountId } = this.props;

    // Refresh when filters change
    if (!_.isEqual(prevProps.filters, filters)) {
      getSpamHits({
        facet,
        filter: facetId,
        from: filters.from,
        relativeRange: filters.relativeRange,
        subaccount: subaccountId,
        to: filters.to
      });
    }
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
      <WrappedComponent {...details} facet={facet} facetId={facetId} gap={gap} xTicks={getDateTicks(filters)} selected={selected} subaccountId={subaccountId} />
    );
  }
}

/**
 * Provides Spam Trap details to the provided component
 * @example
 *   export default withSpamTrapDetails(MyComponent);
 */
function withSpamTrapDetails(WrappedComponent) {
  const Wrapper = (props) => (
    <WithSpamTrapDetails {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = `WithSpamTrapDetails(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  const mapStateToProps = (state, props) => ({
    ...selectSpamHitsDetails(state, props),
    filters: state.signalOptions,
    selected: getSelectedDateFromRouter(state, props)
  });

  return withRouter(connect(mapStateToProps, { getSpamHits })(Wrapper));
}

export default withSpamTrapDetails;
