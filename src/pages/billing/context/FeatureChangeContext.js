import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from '@sparkpost/matchbox';

import { getSubscription } from 'src/actions/billing';
import { selectPlansByKey } from 'src/selectors/accountBillingInfo';
import SupportTicketLink from 'src/components/supportTicketLink/SupportTicketLink';

const FeatureChangeContext = createContext({});

const FeatureChangeProvider = ({
  children,
  plans,
  subscription,
  getSubscription,
  selectedBundle,
  loading
}) => {

  const [index, setIndex] = useState(0);//TODO: Remove

  //Rechecks conditions on re-entering tab. Only initializes once

  //TODO: Remove useCallback to remove mock
  const checkConditions = useCallback(() => { getSubscription(index); setIndex(index + 1); }, [index, getSubscription]);
  useEffect(() => {
    window.addEventListener('focus', checkConditions);
    return () => {
      window.removeEventListener('focus', checkConditions);
    };
  }, [checkConditions, index]);

  const [ actions, updateActions ] = useState({});

  const selectedPlansByProduct = useMemo(() => {
    const { plans: selectedPlans } = selectedBundle;
    return selectedPlans.reduce((res, planId) => {
      const plan = plans[planId];
      return {
        ...res,
        [plan.product]: plan
      };
    }, {});
  }, [plans, selectedBundle]);

  // //Used for finding the features that need to have a proper function
  const calculateDifferences = () => {
    const { products: currentProducts } = subscription;
    const diffObject = currentProducts.reduce((resObject, { product, plan, quantity, override }) => {
      const comparedPlan = selectedPlansByProduct[product];
      switch (product) {
        case 'dedicated_ip':
          if (actions.dedicated_ip || !comparedPlan) {
            resObject[product] = {
              label: 'Dedicated IPs',
              description: (
                <div>
                  <span>
                    Your new plan doesn't include dedicated IPs.
                    Your current IPs will now be billed at $20/month each, or you can
                  </span>
                  <SupportTicketLink issueId="general_issue">
                    submit a ticket
                  </SupportTicketLink>
                  <span>
                    to delete them.
                  </span>
                </div>
              )
            };
          }
          return resObject;
        case 'sso':
        case 'tfa_required':
          if (actions.auth || !comparedPlan) {
            resObject.auth = {
              label: 'Authentication and Security',
              description: 'Your new plan no longer allows for single sign-on and multifactor authentication.'
            };
          }
          return resObject;
        case 'subaccounts': {
          const condition = () => Boolean(comparedPlan && quantity <= comparedPlan.limit);
          if (actions.subaccounts || !condition()) {
            resObject.subaccounts = {
              label: 'Subaccounts',
              description: `Subaccounts quantity needs to be updated. Have ${quantity} ${index}`,
              condition,
              action: <Button external to='/account/subaccounts'>Update Status</Button>
            };
          }
          return resObject;
        }
        case 'messaging':
        default:
          return resObject;
      }
    }, {});
    updateActions({ ...actions, ...diffObject });
  };

  useMemo(calculateDifferences, [subscription]);

  //Confirmation state
  const [ confirmations, setConfirm ] = useState({});
  const onConfirm = (key) => { setConfirm({ ...confirmations, [key]: true }); };

  //Evaluates condition and generates action if condition exists
  const featuresWithActions = useMemo(() => (_.map(actions, ({ action, condition, ...rest }, key) => ({
    ...rest,
    key,
    value: condition ? condition() : confirmations[key],
    action: condition ? action : <Button onClick={() => onConfirm(key)}>Got it</Button>
  }))), [actions, confirmations, onConfirm]);

  //Checks if all provided conditions are good
  const value = {
    isReady: _.every(featuresWithActions, 'value'),
    features: featuresWithActions,
    loading
  };

  return (
    <FeatureChangeContext.Provider value={value}>
      {children}
    </FeatureChangeContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  plans: selectPlansByKey(state),
  subscription: state.billing.subscription,
  loading: state.billing.loading
});

export const FeatureChangeContextProvider = connect(mapStateToProps, { getSubscription })(FeatureChangeProvider);

export const useFeatureChangeContext = () => useContext(FeatureChangeContext);

export default FeatureChangeContext;
