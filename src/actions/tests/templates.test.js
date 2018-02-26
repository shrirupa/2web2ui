import { createMockStore } from 'src/__testHelpers__/mockStore';
import localforage from 'localforage';
import * as templates from '../templates';
import * as templatesHelpers from '../helpers/templates';

import _ from 'lodash';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Templates', () => {
  let mockStore;
  let dispatchMock;

  const user = {
    currentUser: {
      username: 'user'
    }
  };

  beforeEach(() => {
    localforage.setItem = jest.fn((a) => Promise.resolve(a));
    templatesHelpers.getTestDataKey = jest.fn(() => 'key');
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    mockStore = createMockStore(user);
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(templates.listTemplates());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get draft action', () => {
    mockStore.dispatch(templates.getDraft('one'));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get published action', () => {
    mockStore.dispatch(templates.getPublished('two'));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a delete action', () => {
    mockStore.dispatch(templates.deleteTemplate('three'));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create action', () => {
    const data = {
      id: 'id',
      testData: { test: 'data' },
      form: 'data'
    };
    mockStore.dispatch(templates.create(data));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update action', async() => {
    const data = {
      id: 'id',
      testData: { test: 'data' },
      form: 'data'
    };
    const thunk = templates.update(data);
    await thunk(dispatchMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a publish action', async() => {
    const data = {
      id: 'id',
      testData: { test: 'data' },
      form: 'data'
    };
    const thunk = templates.publish(data);
    await thunk(dispatchMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a setTestData action', async() => {
    const data = {
      id: 'id',
      data: { test: 'data' },
      mode: 'draft'
    };
    await mockStore.dispatch(templates.setTestData(data));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a getTestData action', async() => {
    localforage.getItem = jest.fn((a) => Promise.resolve('{ "test": "test" }'));
    const data = { id: 'id', mode: 'draft' };
    await mockStore.dispatch(templates.getTestData(data));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  describe('getTestData', () => {
    it('should handle old test data', async() => {
      localforage.getItem = jest.fn((a) => Promise.resolve('{"test": "test"}'));
      const template = { id: 'id', mode: 'draft' };
      await mockStore.dispatch(templates.getTestData(template));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
    it('should handle partial test data' , async() => {

      localforage.getItem = jest.fn((a) => Promise.resolve('{"substitution_data": {"test": "test"}}'));
      const template = { id: 'id', mode: 'draft' };
      await mockStore.dispatch(templates.getTestData(template));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  it('should dispatch getDraft, getTestData, and getPreview actions', async() => {
    const action = templates.getDraftAndPreview('test-template');
    await mockStore.dispatch(action);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch getPublished, getTestData, and getPreview actions', async() => {
    const action = templates.getPublishedAndPreview('test-template');
    await mockStore.dispatch(action);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a getPreview action', async() => {
    const action = templates.getPreview({
      content: {
        html: '<h1>Test Draft</h1>',
        subject: 'Test Draft'
      },
      id: 'test-template',
      mode: 'draft'
    });
    await mockStore.dispatch(action);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch getTestData and sendPreview actions', async() => {
    const action = templates.sendPreview({
      emails: ['test@example.com'],
      from: 'test@sparkpostbox.com',
      id: 'test-template',
      mode: 'draft'
    });
    await mockStore.dispatch(action);
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
