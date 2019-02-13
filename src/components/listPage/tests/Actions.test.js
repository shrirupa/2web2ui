import React from 'react';
import { shallow } from 'enzyme';

import Actions from '../Actions';

describe('Actions', () => {
  let baseProps;
  const editRoute = '/thang/101';

  beforeEach(() => {
    baseProps = {
      item: { id: 101 }
    };
  });

  const subject = (props) => shallow(<Actions {...baseProps} {...props} />);
  const subjectActions = (props) => subject(props).find('ActionPopover').prop('actions');

  it('should render edit action', () => {
    expect(subjectActions({ editRoute })).toMatchObject([
      { content: 'Edit', to: editRoute }
    ]);
  });

  it('should render delete action', () => {
    expect(subjectActions({ deletable: true, onDelete: jest.fn() })).toMatchObject([
      { content: 'Delete' }
    ]);
  });

  it('should call onDelete with item', () => {
    const props = {
      deletable: true,
      onDelete: jest.fn()
    };
    subjectActions(props)[0].onClick();
    expect(props.onDelete).toHaveBeenCalledWith(baseProps.item);
  });

  it('should render custom actions', () => {
    const props = {
      editRoute,
      deletable: true,
      onDelete: jest.fn(),
      customActions: [
        { content: 'Twiddle', to: '/thang/101/twiddle' },
        { content: 'Frobnicate', onClick: jest.fn() }
      ]
    };
    expect(subjectActions(props)).toEqual(expect.arrayContaining(props.customActions));
  });
});
