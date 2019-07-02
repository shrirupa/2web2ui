import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import DatePicker from 'src/components/datePicker/DatePicker';

import BatchStatusSearch from '../BatchStatusSearch';

describe('BatchStatusSearch', () => {
  const subject = () => {
    const props = {
      now: new Date(),
      disabled: false,
      filters: {},
      onFilterChange: jest.fn()
    };
    return mount(<BatchStatusSearch {...props} />);
  };

  const openDropdown = (wrapper) => {
    wrapper.find('FilterDropdown TextField').simulate('click');
  };

  const clickActionItem = (wrapper, itemLabel) => {
    wrapper
      .find('ActionList a')
      .filterWhere((anchor) => anchor.text().includes(itemLabel))
      .simulate('click');
  };

  const closeDropdown = () => {
    act(() => {
      window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, shiftKey: false }));
    });
  };

  it('calls back when its date range changes', () => {
    const newRange = {
      relativeRange: '7days'
    };

    const wrapper = subject();

    act(() => {
      wrapper.find(DatePicker).prop('onChange')(newRange);
    });
    expect(wrapper.prop('onFilterChange')).toHaveBeenCalledWith(expect.objectContaining(newRange));
  });

  // it.only('calls back when batch ids are entered', () => {
  //   let wrapper;
  //   act(() => {
  //     wrapper = subject();
  //   });
  //   const batchIdsFld = wrapper.find('input[name="batchIds"]');
  //   act(() => {
  //     batchIdsFld.simulate('focus');
  //     batchIdsFld.simulate('change', { target: { value: 'aBatchId' }});
  //     window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', shiftKey: false }));
  //   });
  //   console.log(wrapper.prop('onFilterChange').mock.calls)
  //   expect(wrapper.prop('onFilterChange')).toHaveBeenCalledWith(
  //     expect.objectContaining({ batchIds: 'aBatchId' })
  //   );
  // });

  it('calls back when success state changes', () => {
    const wrapper = subject();
    openDropdown(wrapper);
    clickActionItem(wrapper, 'Success');
    closeDropdown();
    expect(wrapper.prop('onFilterChange')).toHaveBeenCalledWith(
      expect.objectContaining({
        showSuccessful: true
      })
    );
  });
});
