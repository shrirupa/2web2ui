import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getEngagementRateByCohort } from 'src/actions/signals';
import { selectEngagementRateByCohortDetails, getSelectedDateFromRouter } from 'src/selectors/signals';
import { getDateTicks } from 'src/helpers/date';
import { getDisplayName } from 'src/helpers/hoc';
import _ from 'lodash';

export class WithEngagementRateByCohortDetails extends Component {
  componentDidMount() {
    const { getEngagementRateByCohort, facet, facetId, filters, subaccountId } = this.props;
    getEngagementRateByCohort({
      facet,
      filter: facetId,
      from: filters.from,
      relativeRange: filters.relativeRange,
      subaccount: subaccountId,
      to: filters.to
    });
  }

  componentDidUpdate(prevProps) {
    const { getEngagementRateByCohort, facet, facetId, filters, subaccountId } = this.props;

    // Refresh when filters change
    if (!_.isEqual(prevProps.filters, filters)) {
      getEngagementRateByCohort({
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
 * Provides engagement rate by engagement cohort details to the provided component
 * @example
 *   export default withEngagementRateByCohortDetails(MyComponent);
 */
function withEngagementRateByCohortDetails(WrappedComponent) {
  const Wrapper = (props) => (
    <WithEngagementRateByCohortDetails {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = getDisplayName(WrappedComponent, 'withEngagementRateByCohortDetails');

  const mapStateToProps = (state, props) => ({
    ...selectEngagementRateByCohortDetails(state, props),
    filters: state.signalOptions,
    selected: getSelectedDateFromRouter(state, props)
  });

  return withRouter(connect(mapStateToProps, { getEngagementRateByCohort })(Wrapper));
}

export default withEngagementRateByCohortDetails;
