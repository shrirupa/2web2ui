import React from 'react';
import { mount } from 'enzyme';
import cases from 'jest-in-case';
import { array, number, boolean, string, useQueryParams } from '../useQueryParams';
import useRouter from 'src/hooks/useRouter';

jest.mock('src/hooks/useRouter');

describe('useQueryParams', () => {
  describe('hook', () => {
    let router;

    const useTestWrapper = (value = {}) => {
      const TestComponent = () => <div hooked={useQueryParams(value)} />;
      return mount(<TestComponent />);
    };
    const useHook = (wrapper) => wrapper.update().children().prop('hooked');
    const subject = (params) => useHook(useTestWrapper(params)); // eslint-disable-line react-hooks/rules-of-hooks

    beforeEach(() => {
      router = {
        location: {
          pathname: 'http://example.com/path'
        },
        requestParams: {
          param: 'value',
          num: '203',
          flag: 'true',
          anon: 'ymouse'
        },
        history: {
          push: jest.fn()
        }
      };
      useRouter.mockReturnValue(router);
    });

    it('returns params and a helper', () => {
      expect(useHook(useTestWrapper([{ param: string }]))).toEqual(expect.objectContaining({
        params: expect.any(Object),
        setParams: expect.any(Function)
      }));
    });

    it('returns parsed params from route query string', () => {
      const { params } = subject({ param: string, num: number, flag: boolean });
      expect(params).toEqual({
        param: 'value',
        num: 203,
        flag: true,
        anon: 'ymouse'
      });
    });

    it('parses params given function param specifier', () => {
      const numberSpec = jest.fn(number);
      subject({ num: numberSpec });
      expect(numberSpec).toHaveBeenCalledWith('203');
    });

    it('parses params given object param specifier', () => {
      const numberSpec = jest.fn(number);
      subject({ num: { type: numberSpec }});
      expect(numberSpec).toHaveBeenCalledWith('203');
    });

    it('uses default value from specifier', () => {
      expect(subject({ notspecified: { default: '101' }}).params).toEqual(expect.objectContaining({ notspecified: '101' }));
    });

    it('returns a helper that updates query params', () => {
      subject({}).setParams({ name: 'zork' });
      expect(router.history.push).toHaveBeenCalledWith(`${router.location.pathname}?name=zork`);
    });
  });

  cases('type helpers', ({ helper, input, output }) => {
    expect(helper(input)).toEqual(output);
  }, {
    'array wraps single values': { helper: array, input: 'str', output: ['str']},
    'array does not wrap arrays': { helper: array, input: ['str'], output: ['str']},
    'boolean converts "true"': { helper: boolean, input: 'true', output: true },
    'boolean converts "false"': { helper: boolean, input: 'false', output: false },
    'boolean converts ""': { helper: boolean, input: '', output: false },
    'boolean converts null': { helper: boolean, input: null, output: false },
    'string returns string': { helper: string, input: 'str', output: 'str' },
    'string handles ""': { helper: string, input: '', output: '' },
    'string handles null': { helper: string, input: null, output: '' },
    'number converts strings': { helper: number, input: '23', output: 23 },
    'number handles NaN': { helper: number, input: NaN, output: 0 },
    'number handles ""': { helper: number, input: '', output: 0 }
  });
});
