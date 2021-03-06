import { shallow } from 'enzyme';
import React from 'react';
import { RecipientValidationPage } from '../RecipientValidationPage';
import ListForm from '../components/ListForm';
import SingleAddressForm from '../components/SingleAddressForm';
import JobsTableCollection from '../components/JobsTableCollection';
import ApiDetails from '../components/ApiDetails';

describe('Page: Recipient Email Verification', () => {
  let wrapper;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      history: {
        replace: jest.fn()
      }
    };

    wrapper = shallow(<RecipientValidationPage {...props}/>);
    instance = wrapper.instance();
  });

  it('should render Recipient Validation page correctly', () => {
    expect(wrapper.find(ListForm)).toExist();
    expect(wrapper.find(JobsTableCollection)).toExist();
  });

  it('renders single email verification tab correctly when selected', () => {
    wrapper.setState({ selectedTab: 1 });
    expect(wrapper.find(SingleAddressForm)).toExist();
  });

  it('renders Api tab correctly when selected', () => {
    wrapper.setState({ selectedTab: 2 });
    expect(wrapper.find(ApiDetails)).toExist();
  });

  describe('handleTabs', () => {
    it('changes selected tab correctly', () => {
      expect(wrapper.state().selectedTab).toEqual(0);
      instance.handleTabs(1);
      expect(wrapper.state().selectedTab).toEqual(1);
    });
  });
});
