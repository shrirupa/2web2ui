import React from 'react';
import { shallow } from 'enzyme';
import { MessageEventRow } from '../MessageEventRow';

describe('Component: MessageEventRow', () => {
  const props = {
    event: {
      formattedDate: 'formatted',
      type: 'injection',
      friendly_from: 'mean@friendly',
      rcpt_to: 'tom.haverford@pawnee.state.in.us',
      message_id: '123abc',
      event_id: '456xyz',
      history: {
        push: jest.fn()
      }
    }
  };

  it('renders correctly', () => {
    expect(shallow(<MessageEventRow {...props} />)).toMatchSnapshot();
  });
});
