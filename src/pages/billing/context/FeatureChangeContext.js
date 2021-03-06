import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from '@sparkpost/matchbox';

import { getSubscription } from 'src/actions/billing';
import { selectPlansByKey } from 'src/selectors/accountBillingInfo';
// import { pluralString } from 'src/helpers/string';

const FeatureChangeContext = createContext({});

export const FeatureChangeProvider = ({
  children,
  plans,
  subscription,
  selectedBundle,
  loading,
  getSubscription,
}) => {
  const [actions, updateActions] = useState({});
  //State to keep track of features that can't directly be addressed, and are acknowledged by user
  const [confirmations, setConfirm] = useState({});
  const onConfirm = key => {
    setConfirm({ ...confirmations, [key]: true });
  };

  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

  //Rechecks conditions on re-entering tab. Only initializes once
  const checkConditions = useCallback(() => {
    getSubscription();
  }, [getSubscription]);
  useEffect(() => {
    window.addEventListener('focus', checkConditions);
    return () => {
      window.removeEventListener('focus', checkConditions);
    };
  }, [checkConditions]);

  //Keys the selected plan by product to make for easier comparison
  const selectedPlansByProduct = useMemo(() => {
    const { products } = selectedBundle;
    return products.reduce(
      (res, { product, plan: planId }) => ({
        ...res,
        [product]: plans[planId],
      }),
      {},
    );
  }, [plans, selectedBundle]);

  // Used for finding the features that need to have a proper function
  // Inserts into actions if it's got a conflicting issue
  // Updates if it was already in actions had conflicting issue
  const calculateDifferences = () => {
    if (!subscription) {
      return;
    }

    const { products: currentProducts } = subscription;

    const diffObject = currentProducts.reduce((resObject, { product }) => {
      const comparedPlan = selectedPlansByProduct[product];

      switch (product) {
        case 'dedicated_ip':
          if (actions.dedicated_ip || !comparedPlan) {
            resObject[product] = {
              label: 'Dedicated IPs',
              description: (
                <div>
                  <span>
                    {`Your new plan doesn't include dedicated IPs. 
                    Your current IP(s) will be removed at the end of your current billing cycle.`}
                  </span>
                </div>
              ),
            };
          }
          return resObject;
        case 'sso':
        case 'tfa_required':
          if (actions.auth || !comparedPlan) {
            resObject.auth = {
              label: 'Authentication and Security',
              description:
                'Your new plan no longer allows for single sign-on and account-wide requirement of two-factor authentication.',
            };
          }
          return resObject;
        case 'messaging':
        default:
          return resObject;
      }
    }, {});
    updateActions({ ...actions, ...diffObject });
  };

  useMemo(calculateDifferences, [subscription]);

  //Evaluates condition and generates action if condition exists
  const featuresWithActions = useMemo(
    () =>
      _.map(actions, ({ action, condition, ...rest }, key) => ({
        ...rest,
        key,
        value: condition !== undefined ? condition : confirmations[key],
        action:
          condition !== undefined ? action : <Button onClick={() => onConfirm(key)}>Got it</Button>,
      })),
    [actions, confirmations, onConfirm],
  );

  //Checks if all provided conditions are good
  const value = {
    isReady: _.every(featuresWithActions, 'value'),
    features: featuresWithActions,
    loading,
  };

  return <FeatureChangeContext.Provider value={value}>{children}</FeatureChangeContext.Provider>;
};

const mapStateToProps = state => ({
  plans: selectPlansByKey(state),
  subscription: state.billing.subscription,
  loading: state.billing.loading,
});

export const FeatureChangeContextProvider = connect(mapStateToProps, { getSubscription })(
  FeatureChangeProvider,
);

export const useFeatureChangeContext = () => useContext(FeatureChangeContext);

export default FeatureChangeContext;
