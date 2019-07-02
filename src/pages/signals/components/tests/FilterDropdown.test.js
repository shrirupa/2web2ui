import React from 'react';
import { mount } from 'enzyme';

import FilterDropdown from '../FilterDropdown';

describe('FilterDropdown', () => {
  const subject = (props = {}) => {
    const baseProps = {
      options: [{ label: 'option 1', value: 'option1' }, { label: 'option 2', value: 'option2' }],
      initialSelected: [],
      onChange: jest.fn()
    };
    return mount(<FilterDropdown {...baseProps} {...props} />);
  };

  const openDropdown = (wrapper) => wrapper.find('TextField').simulate('click');
  const findOptions = (wrapper) => wrapper.prop('options');
  const findActions = (wrapper) => wrapper.find('ActionList').prop('actions');
  const findActionAnchors = (wrapper) => wrapper.find('ActionList a');

  it('renders options to ActionList', () => {
    const wrapper = subject();
    openDropdown(wrapper);
    expect(findActions(wrapper)).toEqual(
      findOptions(wrapper).map(({ label }) => expect.objectContaining({ content: label }))
    );
  });

  it('selects options using initialSelected prop', () => {
    const initialSelectedValue = 'option2';
    const wrapper = subject({ initialSelected: [initialSelectedValue]});
    openDropdown(wrapper);
    expect(findActions(wrapper)).toEqual(
      findOptions(wrapper).map(({ value }) =>
        expect.objectContaining({
          selected: value === initialSelectedValue
        })
      )
    );
  });

  it('selects options on click', () => {
    const wrapper = subject();
    openDropdown(wrapper);
    findActionAnchors(wrapper)
      .first()
      .simulate('click');
    expect(findActions(wrapper)).toEqual(
      expect.arrayContaining([expect.objectContaining({ content: 'option 1', selected: true })])
    );
  });

  it('deselects options on click', () => {
    const wrapper = subject({ initialSelected: ['option1']});
    openDropdown(wrapper);
    findActionAnchors(wrapper)
      .first()
      .simulate('click');
    expect(findActions(wrapper)).toEqual(
      expect.arrayContaining([expect.objectContaining({ content: 'option 1', selected: false })])
    );
  });

  it('calls back on close', () => {
    const wrapper = subject();
    wrapper.find('Popover').prop('onClose')();
    expect(wrapper.prop('onChange')).toHaveBeenCalledTimes(1);
  });
});
