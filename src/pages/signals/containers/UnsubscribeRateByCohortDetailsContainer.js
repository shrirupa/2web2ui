import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUnsubscribeRateByCohort } from 'src/actions/signals';
import { selectUnsubscribeRateByCohortDetails, getSelectedDateFromRouter } from 'src/selectors/signals';
import { getDateTicks } from 'src/helpers/date';
import { getDisplayName } from 'src/helpers/hoc';
import _ from 'lodash';

export class WithUnsubscribeRateByCohortDetails extends Component {
  componentDidMount() {
    const { getUnsubscribeRateByCohort, facet, facetId, filters, subaccountId } = this.props;
    getUnsubscribeRateByCohort({
      facet,
      filter: facetId,
      from: filters.from,
      relativeRange: filters.relativeRange,
      subaccount: subaccountId,
      to: filters.to
    });
  }

  componentDidUpdate(prevProps) {
    const { getUnsubscribeRateByCohort, facet, facetId, filters, subaccountId } = this.props;

    // Refresh when filters change
    if (!_.isEqual(prevProps.filters, filters)) {
      getUnsubscribeRateByCohort({
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

    return (
      <WrappedComponent {...details} facet={facet} facetId={facetId} xTicks={getDateTicks(filters)} selected={selected} subaccountId={subaccountId} />
    );
  }
}

/**
 * Provides unsubscribe rate by engagement cohort details to the provided component
 * @example
 *   export default withUnsubscribeRateByCohortDetails(MyComponent);
 */
function withUnsubscribeRateByCohortDetails(WrappedComponent) {
  const Wrapper = (props) => (
    <WithUnsubscribeRateByCohortDetails {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = getDisplayName(WrappedComponent, 'withUnsubscribeRateByCohortDetails');

  const mapStateToProps = (state, props) => ({
    ...selectUnsubscribeRateByCohortDetails(state, props),
    filters: state.signalOptions,
    selected: getSelectedDateFromRouter(state, props)
  });

  return withRouter(connect(mapStateToProps, { getUnsubscribeRateByCohort })(Wrapper));
}

export default withUnsubscribeRateByCohortDetails;
