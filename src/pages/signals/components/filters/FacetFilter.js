import React from 'react';
import classnames from 'classnames';
import { Grid, Select, TextField } from '@sparkpost/matchbox';
import { Search } from '@sparkpost/matchbox-icons';
import { onEnter } from 'src/helpers/keyEvents';
import facets from '../../constants/facets';
import withSignalOptions from '../../containers/withSignalOptions';
import styles from './FacetFilter.module.scss';

const OPTIONS = [
  { label: 'No Breakdown', value: '' },
  ...facets.map(({ key, label }) => ({ label: `By ${label}`, value: key }))
];

export class FacetFilter extends React.Component {
  state = {
    prevFacetSearchTerm: '',
    searchTerm: ''
  }

  // note, hydrate searchTerm from signalOptions
  static getDerivedStateFromProps(props, state) {
    const facetSearchTerm = props.signalOptions.facetSearchTerm || '';

    return {
      prevFacetSearchTerm: facetSearchTerm,
      searchTerm: state.prevFacetSearchTerm !== facetSearchTerm ? facetSearchTerm : state.searchTerm
    };
  }

  handleFacetChange = (event) => {
    const { changeSignalOptions } = this.props;
    changeSignalOptions({ facet: event.currentTarget.value, facetSearchTerm: '' });
    this.setState({ searchTerm: '' });
  }

  handleFacetSearch = () => {
    const { changeSignalOptions } = this.props;
    changeSignalOptions({ facetSearchTerm: this.state.searchTerm });
  }

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.currentTarget.value });
  }

  render() {
    const { signalOptions: { facet }} = this.props;
    const { searchTerm } = this.state;

    return (
      <Grid.Column lg={facet ? 4 : 3} xl={facet ? 5 : 3}>
        <div className={classnames(styles.FacetFilter, facet && styles.FacetSelected)}>
          <Select
            onChange={this.handleFacetChange}
            options={OPTIONS}
            value={facet}
          />
          {facet && (
            <TextField
              onChange={this.handleSearchChange}
              onKeyPress={onEnter(this.handleFacetSearch)}
              onBlur={this.handleFacetSearch}
              placeholder="Search"
              suffix={<Search />}
              value={searchTerm}
            />
          )}
        </div>
      </Grid.Column>
    );
  }
}

export default withSignalOptions(FacetFilter);
