import propTypes from 'prop-types';
import { Page } from '@sparkpost/matchbox';

export default {
  banner: propTypes.element,
  columns: propTypes.arrayOf(propTypes.object).isRequired,
  defaultSortColumn: propTypes.string,
  deleteWarning: propTypes.oneOfType([propTypes.element, propTypes.func]),
  empty: Page.propTypes.empty,
  error: propTypes.shape({
    message: propTypes.string
  }),
  filterBox: propTypes.object, // TODO: reference FilterBox propTypes
  formatRow: propTypes.func.isRequired,
  items: propTypes.arrayOf(propTypes.object),
  loading: propTypes.bool,
  loadItems: propTypes.func.isRequired,
  noun: propTypes.string.isRequired,
  onCreate: propTypes.func,
  onDelete: propTypes.func,
  primaryActionTitle: propTypes.string,
  additionalActions: propTypes.arrayOf(propTypes.object)
};
