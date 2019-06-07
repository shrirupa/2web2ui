import React, { useState, useCallback, useMemo } from 'react';
import {
  TextField,
  Popover,
  ActionList
} from '@sparkpost/matchbox';
import { ArrowDropDown } from '@sparkpost/matchbox-icons';

const FilterDropdown = ({ options, initialSelected, label, onChange }) => {
  const [selected, setSelected] = useState(initialSelected);

  const onItemClick = useCallback((e, value) => {
    const isSet = selected.indexOf(value) >= 0;
    setSelected(isSet ? [...selected.filter((item) => item !== value)] : [...selected, value]);
    e.stopPropagation();
  }, [selected]);

  const onClose = useCallback(() => {
    onChange(selected);
  }, [selected, onChange]);

  const formattedOptions = useMemo(
    () =>
      options.map(({ label, value }) => ({
        content: label,
        onClick: (e) => onItemClick(e, value),
        selected: selected.indexOf(value) >= 0
      })),
    [options, selected, onItemClick]
  );

  return (
    <div>
      <Popover
        trigger={<TextField readOnly value={label} prefix={selected.length ? `(${selected.length})` : null} suffix={<ArrowDropDown />} />}
        onClose={onClose}
      >
        <ActionList actions={formattedOptions} />
      </Popover>
    </div>
  );
};

export default FilterDropdown;
