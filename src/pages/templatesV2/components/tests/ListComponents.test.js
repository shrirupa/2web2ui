import { shallow } from 'enzyme';
import React from 'react';
import { DeleteAction, LastUpdated, Name, Status } from '../ListComponents';

describe('Template List Components', () => {
  let wrapper;

  describe('Name', () => {
    beforeEach(() => {
      const props = { name: 'template name', id: 'id-123', subaccount_id: 123, list_status: 'draft' };
      wrapper = shallow(<Name {...props} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should navigate to published page if template is published', () => {
      wrapper.setProps({ list_status: 'published' });
      expect(wrapper.find('Link').props().to).toEqual('/templatesv2/edit/id-123/published/content?subaccount=123');
    });
  });

  describe('Status', () => {
    it('should render published', () => {
      expect(shallow(<Status list_status='published'/>)).toMatchSnapshot();
    });

    it('should render draft', () => {
      expect(shallow(<Status list_status='draft'/>)).toMatchSnapshot();
    });

    it('should render unpublished changes', () => {
      expect(shallow(<Status list_status='published_with_draft'/>)).toMatchSnapshot();
    });
  });

  describe('DeleteAction', () => {
    it('should render correctly', () => {
      expect(shallow(<DeleteAction/>)).toMatchSnapshot();
    });

    it('should invoke delete', () => {
      const fn = jest.fn();
      const props = { onClick: fn, name: 'Foo', id: 'bar' };
      const wrapper = shallow(<DeleteAction {...props} />);
      wrapper.find('Button').simulate('click');
      expect(fn).toHaveBeenCalledWith({ id: 'bar', name: 'Foo' });
    });
  });

  describe('LastUpdated', () => {
    it('should render', () => {
      expect(shallow(<LastUpdated last_update_time='2017-08-10T14:15:16+00:00'/>)).toMatchSnapshot();
    });
  });
});
