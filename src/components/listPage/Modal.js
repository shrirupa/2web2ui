import React from 'react';
import propTypes from 'prop-types';
import { DeleteModal } from 'src/components';

const Modal = ({ noun, item, children, ...rest }) => (
  <DeleteModal
    title={`Are you sure you want to delete this ${noun}?`}
    content={rest.open && children ? children({ noun, item }) : null}
    {...rest}
  />
);
Modal.displayName = 'ListPage.Modal';
Modal.propTypes = {
  noun: propTypes.string.isRequired,
  item: propTypes.object
};

export default Modal;
