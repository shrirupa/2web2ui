import propTypes from 'prop-types';
import { Page } from '@sparkpost/matchbox';

export default {
  columns: propTypes.arrayOf(propTypes.object).isRequired,
  defaultSortColumn: propTypes.string,
  empty: Page.propTypes.empty,
  error: propTypes.shape({
    message: propTypes.string
  }),
  filterBox: propTypes.object, // TODO: reference FilterBox propTypes
  items: propTypes.arrayOf(propTypes.object),
  loading: propTypes.bool,
  loadItems: propTypes.func.isRequired,
  noun: propTypes.string.isRequired,
  onDelete: propTypes.func,
  primaryAction: propTypes.shape({
    content: propTypes.node,
    to: propTypes.string.isRequired
  }),
  additionalActions: propTypes.arrayOf(propTypes.object),
  children: propTypes.func.isRequired
};
