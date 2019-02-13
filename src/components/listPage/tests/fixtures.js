const noun = 'sprocket';

const columns = [ { label: 'Name', sortKey: 'name' }, { label: 'Diameter', sortKey: 'diam' }];

const items = [
  { name: 'm3 bolt', diam: 3, scale: 'metric' },
  { name: 'm3 nut', diam: 3, scale: 'metric' },
  { name: '16mm wingnut', diam: 16, scale: 'metric' },
  { name: '22mm wingnut', diam: 22, scale: 'metric' },
  { name: '1/8" wingnut', diam: 3, scale: 'imperial' },
  { name: '3/8" wingnut', diam: 9, scale: 'imperial' },
  { name: '5/8" wingnut', diam: 15, scale: 'imperial' },
  { name: '7/8" wingnut', diam: 18, scale: 'imperial' },
  { name: '1 1/8" wingnut', diam: 21, scale: 'imperial' },
  { name: '1 3/8" wingnut', diam: 30, scale: 'imperial' },
  { name: '1 5/8" wingnut', diam: 36, scale: 'imperial' }
];

const error = { message: 'Workshop closed' };

const filterBox = {
  keyMap: { role: 'access' },
  exampleModifiers: ['name', 'diam'],
  itemToStringKeys: ['diam']
};

export { noun, columns, items, error, filterBox };
