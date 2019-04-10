import { shallow } from 'enzyme';
import React from 'react';
import { HealthScoreChart } from '../HealthScoreChart';
Date.now = jest.fn(() => 1553699129000);

describe('Signals Health Score Chart', () => {
  let props;
  let subject;

  beforeEach(() => {
    props = {
      loading: false,
      error: null,
      current_health_score: 88,
      WoW: -5, current_DoD: 5,
      history: [{
        date: '2019-03-24',
        health_score: 75,
        injections: 75000000000,
        ranking: 'warning'
      },{
        date: '2019-03-25',
        health_score: 96,
        injections: 75000000000,
        ranking: 'good'
      },{
        date: '2019-03-26',
        health_score: 23,
        injections: 75000000000,
        ranking: 'danger'
      },{
        date: '2019-03-27',
        health_score: null,
        ranking: null
      }],
      filters: {
        relativeRange: '90days',
        from: '2014-12-01',
        to: '2015-02-01'
      }
    };

    subject = (options = {}) => shallow(
      <HealthScoreChart {...props} {...options} />
    );
  });

  it('renders happy path correctly', () => {
    expect(subject(props)).toMatchSnapshot();
  });

  it('renders loading correctly', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper.find('PanelLoading')).toExist();
  });

  it('renders error correctly', () => {
    const wrapper = subject({ error: { message: 'mock error' }});
    expect(wrapper.find('Callout')).toMatchSnapshot();
  });

  it('renders no account level data callout correctly', () => {
    props.history = [];
    const wrapper = subject(props);
    expect(wrapper.find('Callout')).toMatchSnapshot();
  });

  it('renders metric displays', () => {
    const wrapper = subject({ defaultHovered: '2019-03-26' });
    expect(wrapper.find('MetricDisplay').at(0)).toMatchSnapshot();
    expect(wrapper.find('MetricDisplay').at(1)).toMatchSnapshot();
  });
});
