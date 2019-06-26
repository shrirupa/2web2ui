import React from 'react';
import { shallow } from 'enzyme';
import useEditorContext from '../../hooks/useEditorContext';
import TestDataSection from '../TestDataSection';

jest.mock('../../hooks/useEditorContext');

describe('TestDataSection', () => {
  const subject = ({ stateOverride } = {}) => {
    useEditorContext.mockReturnValue({
      testData: JSON.stringify({
        subject: 'Example Subject'
      }),
      setTestData: jest.fn(),
      ...stateOverride
    });

    return shallow(<TestDataSection/>);
  };

  it('renders test data editor', () => {
    expect(subject()).toMatchSnapshot();
  });
});
