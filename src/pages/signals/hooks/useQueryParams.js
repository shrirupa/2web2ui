import { useState, useCallback, useLayoutEffect } from 'react';
import qs from 'qs';
import moment from 'moment';

import useRouter from 'src/hooks/useRouter';

import { comparableJson } from '../helpers/hooks';

const toQueryString = (params) => qs.stringify(params, { arrayFormat: 'repeat' });

export const array = (param) => (Array.isArray(param) ? param : [param]);
export const boolean = (param) => (param === 'true' ? true : false);
export const string = (param) => (param ? param : '');
export const number = (param) => Number(param) || 0;
export const date = (param) => (param ? moment(param).toDate() : '');

const defaults = {
  [array]: [],
  [boolean]: false,
  [string]: '',
  [number]: 0,
  [date]: ''
};

const getFieldType = (spec) => ('type' in spec ? spec.type : spec);
const convertField = (value, fldType) => getFieldType(fldType)(value);
const makeDefault = (fldType) =>
  fldType.default ? fldType.default : defaults[getFieldType(fldType)];

const applySchema = (obj, schema) => {
  const updates = Object.entries(schema).reduce(
    (acc, [fldName, fldType]) =>
      fldName in obj
        ? { [fldName]: convertField(obj[fldName], fldType), ...acc }
        : { [fldName]: makeDefault(fldType), ...acc },
    {}
  );

  return { ...obj, ...updates };
};

/*
 * Provide a way to keep page-level state in route request params.
 */
export const useQueryParams = (schema) => {
  const { location, history, requestParams } = useRouter();
  const [queryParams, setQueryParams] = useState(applySchema(requestParams, schema));

  // On receipt of new params, we update the route.
  const updateRoute = useCallback(
    (newParams) => {
      const queryString = toQueryString(newParams);
      history.push(`${location.pathname}?${queryString}`);
    },
    [history, location.pathname]
  );

  // On mount, update the route from initial parsed and default params
  useLayoutEffect(() => {
    updateRoute(queryParams);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On route change, update our local copy of state
  useLayoutEffect(
    () => {
      const newParams = applySchema(requestParams, schema);
      if (comparableJson(newParams) !== comparableJson(queryParams)) {
        setQueryParams(newParams);
      }
    },
    [requestParams, queryParams, setQueryParams, schema]
  );

  return { params: queryParams, setParams: updateRoute };
};
