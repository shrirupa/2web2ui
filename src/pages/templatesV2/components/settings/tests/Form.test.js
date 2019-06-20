import { shallow } from 'enzyme';
import React from 'react';
import every from 'lodash/every';
import SettingsForm from '../Form';

jest.mock('../../DeleteTemplate');

describe('SettingsForm', () => {
  const subject = (props) => {
    const defaultProps = {
      domains: [
        { domain: 'test.com' },
        { domain: 'verified.com' }
      ],
      domainsLoading: false,
      hasSubaccounts: false,
      canViewSubaccount: false,
      isPublishedMode: false,
      handleSubmit: jest.fn((func) => func),
      showAlert: jest.fn()
    };

    return shallow(<SettingsForm {...defaultProps} {...props} />);
  };

  it('renders without subaccounts', () => {
    const wrapper = subject();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.exists('SubaccountSection')).toBe(false);
  });

  it('renders with subaccounts', () => {
    expect(subject({ hasSubaccounts: true, canViewSubaccount: true }).exists('SubaccountSection')).toBe(true);
  });

  it('renders with fields disabled in published mode', () => {
    const wrapper = subject({ hasSubaccounts: true, canViewSubaccount: true, isPublishedMode: true });
    const fieldProps = wrapper.find('Field').map((field) => field.prop('disabled'));
    expect(fieldProps.length).toEqual(10);
    expect(every(fieldProps)).toBe(true);
    expect(wrapper.find('SubaccountSection').prop('disabled')).toBe(true);
  });

  it('renders From Email help text with no verified domains', () => {
    const wrapper = subject({ domains: []});
    expect(wrapper.find('[name="content.from.email"]').prop('helpText'))
      .toEqual('You do not have any verified sending domains to use.');
  });

  it('renders From Email help text with no verified domains for subaccount', () => {
    const wrapper = subject({ subaccountId: 101, domains: []});
    expect(wrapper.find('[name="content.from.email"]').prop('helpText'))
      .toEqual('The selected subaccount does not have any verified sending domains.');
  });

  it('renders id field disabled', () => {
    expect(subject().find('[name="id"]').prop('disabled')).toBe(true);
  });

  describe('parseToggle', () => {
    const instance = subject().instance();
    it('converts value to boolean', () => {
      expect(instance.parseToggle('1')).toBe(true);
      expect(instance.parseToggle('')).toBe(false);
      expect(instance.parseToggle(true)).toBe(true);
      expect(instance.parseToggle(false)).toBe(false);
    });
  });

  describe('form submission', () => {
    it('renders submit button disabled', () => {
      const buttonSelector = 'Button[type="submit"]';

      expect(subject({
        submitting: false,
        valid: false,
        pristine: true
      }).find(buttonSelector).prop('disabled')).toBe(true);
      expect(subject({
        submitting: false,
        valid: false,
        pristine: false
      }).find(buttonSelector).prop('disabled')).toBe(true);
      expect(subject({
        submitting: true,
        valid: true,
        pristine: false
      }).find(buttonSelector).prop('disabled')).toBe(true);
    });

    it('updates settings', async () => {
      const mockUpdateDraft = jest.fn(() => Promise.resolve());
      const mockAlert = jest.fn();
      const wrapper = subject({
        valid: true,
        pristine: false,
        updateDraft: mockUpdateDraft,
        draft: { id: 'foo' },
        showAlert: mockAlert
      });
      await wrapper.find('form').simulate('submit');
      expect(mockUpdateDraft).toHaveBeenCalledWith({ id: 'foo' }, undefined);
      expect(mockAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template settings updated.' });
    });

    it('updates settings with subaccount', () => {
      const mockUpdateDraft = jest.fn(() => Promise.resolve());
      const wrapper = subject({
        valid: true,
        pristine: false,
        updateDraft: mockUpdateDraft,
        draft: { id: 'foo' },
        subaccountId: 101
      });
      wrapper.find('form').simulate('submit');
      expect(mockUpdateDraft).toHaveBeenCalledWith({ id: 'foo' }, 101);
    });
  });

  describe('Delete Template', () => {
    it('renders delete template', () => {
      expect(subject().exists('DeleteTemplate')).toBe(true);
    });

    it('shows alert after delete and redirects', async () => {
      const mockAlert = jest.fn();
      const mockHistory = { push: jest.fn() };
      await subject({ showAlert: mockAlert, history: mockHistory }).find('DeleteTemplate').prop('afterDelete')();
      expect(mockAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template deleted.' });
      expect(mockHistory.push).toHaveBeenCalledWith('/templatesv2');
    });
  });
});
