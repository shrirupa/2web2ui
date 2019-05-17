import React, { useState, useEffect } from 'react';
import _ from 'lodash';

function useComponentSelect(data) {
  const [components, setComponents] = useState([]);

  function addComponent(key, replaceIndex) {
    const component = { key };
    let list = components;

    if (replaceIndex !== undefined) {
      list = [...list.slice(0, replaceIndex), component, ...list.slice(replaceIndex + 1)];
    } else {
      list = [...list, component]
    }

    buildData(list);
  };

  function removeComponent(key) {
    setComponents(_.remove(components, ({ key: k }) => k !== key ));
  }

  function buildData(nextComponents) {
    setComponents(_.map(nextComponents, ({ key }) => ({
        key,
        data: _.map(data, ({ date, weights }) => ({
          date,
          weight: _.find(weights, ['weight_type', key]).weight,
          value: _.find(weights, ['weight_type', key]).weight_value
        }))
      })
    ))
  }

  useEffect(() => {
    buildData(components);
  }, [data.length, components.length])

  return [components, addComponent, removeComponent];
}

export default useComponentSelect;
