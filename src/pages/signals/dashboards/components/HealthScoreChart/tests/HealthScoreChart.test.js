import { shallow } from 'enzyme';
import React from 'react';
import { HealthScoreChart } from '../HealthScoreChart';
import * as dateMock from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Signals Health Score Chart', () => {
  let props; let subject;

  beforeEach(() => {
    props = {
      loading: false,
      error: null,
      data: [{
        sid: -1,
        current_health_score: 88,
        WoW: -5, current_DoD: 5,
        history: [{
          date: '2019-03-24',
          health_score: 75,
          ranking: 'warning'
        },{
          date: '2019-03-25',
          health_score: 96,
          ranking: 'good'
        },{
          date: '2019-03-26',
          health_score: 23,
          ranking: 'danger'
        },{
          date: '2019-03-25',
          health_score: null,
          ranking: null
        }]
      }],
      filters: {
        relativeRange: '90days'
      }
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
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
    props.data = [];
    const wrapper = subject(props);
    expect(wrapper.find('Callout')).toMatchSnapshot();
  });

  it('renders yesterday as selected date if one is missing', () => {
    props.data[0].history = [];
    expect(subject(props)).toMatchSnapshot();
  });
});
