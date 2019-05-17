import React, { useState, useRef } from 'react';
import { WindowEvent, Popover, ActionList } from '@sparkpost/matchbox';
import { Add, Clear } from '@sparkpost/matchbox-icons';
import { HEALTH_SCORE_COMPONENT_INFO, HEALTH_SCORE_COMPONENTS } from 'src/pages/signals/constants/info';
import _ from 'lodash';

import styles from './Select.module.scss';

export function Component({ edge, selected, add, remove, components }) {
  const [open, setOpen] = useState(false);
  const popover = useRef();
  const container = useRef();

  const unselected = _.keys(HEALTH_SCORE_COMPONENTS).filter((key) => !_.find(components, ['key', key]))

  if (unselected.length === 0 && !selected) {
    return null;
  }

  function handleRemove(key) {
    setOpen(false);
    remove(key)
  }

  function handleAdd(key, i) {
    if (!unselected.includes(key)) {
      return;
    }

    setOpen(false);
    add(key, !edge ? _.findIndex(components, ['key', selected]) : undefined);
  }

  function handleOutsideclick(e) {
    const isOutside = popover.current && !popover.current.contains(e.target) && container.current && !container.current.contains(e.target);

    if (open && isOutside) {
      setOpen(false);
    }
  }

  function trigger() {
    if (edge) {
      return <a onClick={() => setOpen(true)} className={styles.AddIcon}><Add size={21} /></a>
    }

    return (
      <div className={styles.Component}>
        <label className={styles.ComponentLabel}>Component <a onClick={() => handleRemove(selected)}><Clear size={14} className={styles.RemoveIcon} /></a></label>
        <div className={styles.ComponentWeight}><a onClick={() => setOpen(true)}>{selected && HEALTH_SCORE_COMPONENTS[selected].label}</a></div>
      </div>
    )
  }

  const filteredActions = _.map(_.keys(HEALTH_SCORE_COMPONENTS), (key) => ({
      content: HEALTH_SCORE_COMPONENTS[key].label,
      onClick: () => handleAdd(key),
      selected: !unselected.includes(key)
    })
  )

  return (
    <div className={styles.ComponentWrapper} ref={container}>
      <WindowEvent event='click' handler={handleOutsideclick} />
      {selected && <div className={styles.ComponentAnd}>and</div>}
      <div className={styles.ComponentPopover}>
        <Popover trigger={trigger()} open={open} style={{width:'230px'}}>
          <div ref={popover}>
            <ActionList actions={filteredActions} />
          </div>
        </Popover>
      </div>
    </div>
  )
}

export function HealthScoreSelect() {
  return (
    <div className={styles.ComponentWrapper}>
      <div className={styles.Component}>
        <label className={styles.ComponentLabel}>Show</label>
        <div className={styles.ComponentWeight, styles.ComponentWeight}>Health Score</div>
      </div>
    </div>
  )
}

export function ComponentSelect({ add, remove, components }) {
  const list = _.map(components, ({ key }, i) => (
    <Component
      add={add}
      selected={key}
      components={components}
      remove={remove}
    />
  ));

  list.push(
    <Component
      key='edge'
      edge
      add={add}
      components={components}
      remove={remove}
    />
  );

  return (
    <div className={styles.SelectWrapper}>
      <HealthScoreSelect />
      {list}
    </div>
  )
}
