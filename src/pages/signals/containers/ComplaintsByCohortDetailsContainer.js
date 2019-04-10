import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getComplaintsByCohort } from 'src/actions/signals';
import { selectComplaintsByCohortDetails, getSelectedDateFromRouter } from 'src/selectors/signals';
import { getDateTicks } from 'src/helpers/date';
import { getDisplayName } from 'src/helpers/hoc';
import _ from 'lodash';

export class WithComplaintsByCohortDetails extends Component {
  componentDidMount() {
    const { getComplaintsByCohort, facet, facetId, filters, subaccountId } = this.props;
    getComplaintsByCohort({
      facet,
      filter: facetId,
      from: filters.from,
      relativeRange: filters.relativeRange,
      subaccount: subaccountId,
      to: filters.to
    });
  }

  componentDidUpdate(prevProps) {
    const { getComplaintsByCohort, facet, facetId, filters, subaccountId } = this.props;

    // Refresh when filters change
    if (!_.isEqual(prevProps.filters, filters)) {
      getComplaintsByCohort({
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
 *   export default withComplaintsByCohortDetails(MyComponent);
 */
function withComplaintsByCohortDetails(WrappedComponent) {
  const Wrapper = (props) => (
    <WithComplaintsByCohortDetails {...props} component={WrappedComponent} />
  );

  Wrapper.displayName = getDisplayName(WrappedComponent, 'withComplaintsByCohortDetails');

  const mapStateToProps = (state, props) => ({
    ...selectComplaintsByCohortDetails(state, props),
    filters: state.signalOptions,
    selected: getSelectedDateFromRouter(state, props)
  });

  return withRouter(connect(mapStateToProps, { getComplaintsByCohort })(Wrapper));
}

export default withComplaintsByCohortDetails;
