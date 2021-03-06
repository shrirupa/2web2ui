import React from 'react';
import { ChangePlanForm } from '../ChangePlanForm';
import { shallow } from 'enzyme';
import * as conversions from 'src/helpers/conversionTracking';
import * as billingHelpers from 'src/helpers/billing';

jest.mock('src/helpers/billing');
jest.mock('src/helpers/conversionTracking');

describe('Form Container: Change Plan', () => {
  let wrapper;
  let submitSpy;
  let instance;

  const plans = [
    {
      isFree: false,
      code: 'paid',
      volume: 15000
    },
    {
      isFree: true,
      code: 'free',
      volume: 100000
    }
  ];

  let props;

  beforeEach(() => {
    props = {
      account: {
        subscription: { self_serve: true, code: 'free' },
        billing: {}
      },
      isSelfServeBilling: true,
      billing: { countries: [], plans, selectedPromo: {}},
      getPlans: jest.fn(() => Promise.resolve()),
      getBillingCountries: jest.fn(),
      verifyPromoCode: jest.fn(() => Promise.resolve({ discount_id: 'test-discount' })),
      getBillingInfo: jest.fn(),
      fetchAccount: jest.fn(),
      plans,
      currentPlan: {},
      selectedPlan: {},
      canUpdateBillingInfo: false,
      history: { push: jest.fn(), replace: jest.fn() },
      location: {
        pathname: '/account/billing/plan',
        search: 'immediatePlanChange=free-0817&pass=through'
      },
      initialValues: {
        promoCode: undefined
      },
      handleSubmit: jest.fn(),
      showAlert: jest.fn(),
      billingCreate: jest.fn(() => Promise.resolve()),
      billingUpdate: jest.fn(() => Promise.resolve()),
      updateSubscription: jest.fn(() => Promise.resolve()),
      isAws: false
    };
    wrapper = shallow(<ChangePlanForm {...props} />);
    instance = wrapper.instance();
    submitSpy = jest.spyOn(instance.props, 'handleSubmit');
    billingHelpers.prepareCardInfo = jest.fn((a) => a);
    billingHelpers.stripImmediatePlanChange = jest.fn(() => 'pass=through');
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get plans and countries on mount', () => {
    expect(props.fetchAccount).toHaveBeenCalled();
    expect(props.getBillingInfo).toHaveBeenCalled();
    expect(props.getPlans).toHaveBeenCalled();
    expect(props.getBillingCountries).toHaveBeenCalled();
  });

  it('should not show plans', () => {
    wrapper.setProps({ plans: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show saved card', () => {
    expect(wrapper).toHaveState('useSavedCC', null);
    wrapper.setProps({ canUpdateBillingInfo: true });
    expect(wrapper).toHaveState('useSavedCC', true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render payment form if selecting free', () => {
    wrapper.setProps({ selectedPlan: { isFree: true }});
    expect(wrapper.find('CardSummary')).not.toExist();
    expect(wrapper.find('Connect(PaymentForm)')).not.toExist();
    expect(wrapper.find('Connect(BillingAddressForm)')).not.toExist();
  });

  it('should toggle savedCard state', () => {
    expect(instance.state.useSavedCC).toEqual(null);
    instance.handleCardToggle();
    expect(instance.state.useSavedCC).toEqual(true);
  });

  it('should submit redux-form', () => {
    wrapper.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should render error', () => {
    wrapper.setProps({ error: { message: 'Oh no! It broke.' }});
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    let values;

    beforeEach(() => {
      values = { key: 'value', planpicker: { code: 'paid', billingId: 'test-id' }, card: 'card info' };
    });

    // Upgrade from free to new paid plan for the first time
    it('should call billingCreate when no billing account exists', async () => {
      const { billing, ...account } = props.account;
      wrapper.setProps({ account }); // remove billing from account
      await instance.onSubmit(values);
      expect(props.billingCreate).toHaveBeenCalledWith(values);
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should verify promo code if passed in as initial value', async () => {
      props.initialValues = { promoCode: 'initial-promo-code' };
      props.selectedPlan = { billingId: 'test-id' };
      wrapper = await shallow(<ChangePlanForm {...props} />);
      expect(props.getPlans).toHaveBeenCalled();
      expect(props.verifyPromoCode).toHaveBeenCalledWith({
        promoCode: 'initial-promo-code',
        billingId: 'test-id',
        meta: { promoCode: 'initial-promo-code', showErrorAlert: false }
      });
    });

    it('should call verify if promo code is attached and update subscription', async () => {
      const billing = { ...props.billing, selectedPromo: { promoCode: 'test-promo-code' }};
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ billing });
      await instance.onSubmit(values);
      expect(props.verifyPromoCode).toHaveBeenCalledWith({
        promoCode: 'test-promo-code',
        billingId: 'test-id',
        meta: { promoCode: 'test-promo-code' }
      });
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'paid' , promoCode: 'test-promo-code' });
      expect(props.billingUpdate).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });


    it('should interrupt submission if validation of promo code fails', async () => {
      expect.assertions(3);
      const verifyPromoCode = jest.fn(() => Promise.reject({}));
      const billing = { ...props.billing, selectedPromo: { promoCode: 'test-promo-code' }};
      wrapper.setProps({ billing, verifyPromoCode });
      return instance.onSubmit(values).catch(() => {
        expect(props.billingUpdate).not.toHaveBeenCalled();
        expect(props.updateSubscription).not.toHaveBeenCalled();
        expect(props.history.push).not.toHaveBeenCalled();
      });
    });

    // Changing plan and changing card
    it('should update billing account when billing account exists entering a new cc', async () => {
      await instance.onSubmit(values);
      expect(props.billingUpdate).toHaveBeenCalledWith(values);
      expect(props.updateSubscription).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should update subscription for aws account', async () => {
      wrapper.setProps({ isAws: true });
      await instance.onSubmit({ ...values, planpicker: { code: 'paid' }});
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'paid' });
    });

    // Changing plan and using existing card
    it('should update subscription when billing account exists without entering new cc info', async () => {
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ ...values, planpicker: { code: 'paid' }});
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'paid' });
      expect(props.billingUpdate).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    // Downgrade to free
    it('should update subscription on downgrade to free', async () => {
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ ...values, planpicker: { code: 'free', isFree: true }});
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'free' });
      expect(props.billingUpdate).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should not prepare card info if downgrading to free', async () => {
      await instance.onSubmit({ ...values, planpicker: { code: 'free', isFree: true }});
      expect(billingHelpers.prepareCardInfo).not.toHaveBeenCalled();
    });

    it('should prepare card info if changing to paid plan', async () => {
      await instance.onSubmit({ ...values, planpicker: { code: 'paid' }});
      expect(billingHelpers.prepareCardInfo).toHaveBeenCalledWith(values.card);
    });

    it('should track the plan change', async () => {
      await instance.onSubmit(values);
      expect(conversions.trackPlanChange).toHaveBeenCalledWith({
        allPlans: plans,
        oldCode: 'free',
        newCode: 'paid'
      });
    });
  });
});
