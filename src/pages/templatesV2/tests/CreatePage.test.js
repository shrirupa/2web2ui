import React from 'react';
import { shallow } from 'enzyme';

import CreatePage from '../CreatePage';

describe('CreatePage', () => {
  const subject = (props = {}) => shallow(
    <CreatePage
      loading={false}
      submitting={false}
      pristine={true}
      handleSubmit={(handler) => handler}
      listDomains={jest.fn()}
      history={{ push: jest.fn() }}
      showAlert={jest.fn()}
      {...props}
    />
  );

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders correctly on loading', () => {
    expect(subject({ loading: true }).find('Loading')).toExist();
  });

  it('loads domains on load', () => {
    const mockListDomains = jest.fn();
    subject({ listDomains: mockListDomains });
    expect(mockListDomains).toHaveBeenCalledTimes(1);
  });

  describe('Submit button', () => {
    it('renders disable states correctly', () => {
      expect(subject({ submitting: true, pristine: false, valid: true }).find('Button').prop('disabled')).toBe(true);
      expect(subject({ submitting: false, pristine: true, valid: true }).find('Button').prop('disabled')).toBe(true);
      expect(subject({ submitting: false, pristine: false, valid: false }).find('Button').prop('disabled')).toBe(true);
    });
    it('renders enabled states correctly', () => {
      expect(subject({ submitting: false, pristine: false, valid: true }).find('Button').prop('disabled')).toBe(false);
    });
  });

  describe('handleCreate', () => {
    it('submits correctly with form data', () => {
      const mockCreate = jest.fn(() => Promise.resolve());
      const formData = { name: 'Foo', id: 'foo', content: {}};
      const wrapper = subject({ create: mockCreate, history: { push: jest.fn() }});
      wrapper.find('form').simulate('submit', formData);
      expect(mockCreate).toHaveBeenCalledWith({ ...formData, content: { ...formData.content, text: '' }});
    });

    it('alerts & redirects to edit page', async () => {
      const mockPush = jest.fn();
      const mockAlert = jest.fn();
      const wrapper = subject({ create: jest.fn(() => Promise.resolve()), history: { push: mockPush }, showAlert: mockAlert });
      await wrapper.find('form').simulate('submit', { id: 'foo', content: {}});
      expect(mockPush).toHaveBeenCalledWith('/templatesv2/edit/foo/draft/content');
      expect(mockAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template Created.' });
    });
  });
});
