import React from 'react';
import propTypes from 'prop-types';
import PageLink from 'src/components/pageLink';
import { ActionPopover } from 'src/components';

const Actions = ({ item, editRoute, deletable, onDelete, customActions }) => {
  const baseActions = [
    editRoute && {
      component: PageLink,
      content: 'Edit',
      to: editRoute
    },
    deletable && {
      content: 'Delete',
      onClick: () => onDelete(item)
    }
  ].filter(Boolean);

  const actions = [...baseActions, ...customActions];
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
