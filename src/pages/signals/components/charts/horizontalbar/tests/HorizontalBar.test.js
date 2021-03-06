import { shallow } from 'enzyme';
import React from 'react';
import HorizontalBar from '../HorizontalBar';

describe('HorizontalBar Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      value: { value: 2, fill: 'blue', date: '2011-01-01' },
      xKey: 'value',
      xRange: [0,5],
      height: 50,
      width: 100,
      onClick: jest.fn(),
      tooltipContent: jest.fn()
    };
    wrapper = shallow(<HorizontalBar {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with color', () => {
    wrapper.setProps({ color: '#b252d1' });
    const BarShape = wrapper.find('Bar').prop('shape');
    const barWrapper = shallow(<BarShape />);
    expect(barWrapper.prop('fill')).toEqual('#b252d1');
  });

  it('should handle click', () => {
    wrapper.find('Bar').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });
});
