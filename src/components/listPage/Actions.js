import React from 'react';
import propTypes from 'prop-types';
import PageLink from 'src/components/pageLink';
import { ActionPopover } from 'src/components';

const Actions = ({ item, editRoute, deletable, onDelete, customActions }) => {
  const actions = [
    editRoute && {
      component: PageLink,
      content: 'Edit',
      to: editRoute
    },
    deletable && {
      content: 'Delete',
      onClick: () => onDelete(item)
    },
    ...customActions
  ].filter(Boolean);

  return <ActionPopover actions={actions} />;
};

Actions.propTypes = {
  item: propTypes.object.isRequired,
  onDelete: propTypes.func,
  editRoute: propTypes.string,
  deletable: propTypes.bool,
  customActions: ActionPopover.propTypes.actions
};

Actions.defaultProps = {
  customActions: []
};

export default Actions;
